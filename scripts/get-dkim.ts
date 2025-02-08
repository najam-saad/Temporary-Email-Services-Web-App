import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface ImprovMXResponse {
  success: boolean;
  domain: {
    active: boolean;
    added: number;
    aliases: Array<{
      alias: string;
      created: number;
      forward: string;
      id: number;
    }>;
    banned: boolean;
    display: string;
    dkim_selector: string;
    domain: string;
    notification_email: string | null;
    strict_mxes: boolean;
    webhook: string | null;
    whitelabel: string | null;
  };
}

async function getDKIMSettings(): Promise<void> {
  const API_KEY = process.env.IMPROVMX_API_KEY;
  const DOMAIN = process.env.DOMAIN;
  
  if (!API_KEY || !DOMAIN) {
    console.error('Missing required environment variables');
    return;
  }

  const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

  try {
    console.log('Fetching domain settings...');
    console.log('Domain:', DOMAIN);
    
    const response = await axios.get<ImprovMXResponse>(
      `https://api.improvmx.com/v3/domains/${DOMAIN}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    );

    const { domain } = response.data;
    
    console.log('\nDNS Records to add in Hostinger:\n');
    
    console.log('1. DKIM Record:');
    console.log('Type: TXT');
    console.log(`Host: ${domain.dkim_selector}._domainkey`);
    console.log('Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHyTxPwXyZhDkpHxVhYmS9JGz3HlW4yhnhCW+JWrYztiD+tiWEXG6RxvXVIkTh0Bc6sE/WKQTc6T6qyqJ9/Jhi+Ys4I9Sj9YgqvPqjqE3Jx5QUQtR7BXhFMGA+YXtXv0OOo4k8gxqs8Ol7T2TSA/c9n3V6g1E5LE+bCQB+FXyYGwIDAQAB');
    console.log('TTL: 300\n');

    console.log('2. DMARC Record:');
    console.log('Type: TXT');
    console.log('Host: _dmarc');
    console.log('Value: "v=DMARC1; p=none; rua=mailto:najam.saad99@gmail.com"');
    console.log('TTL: 300\n');

    console.log('3. Required Records:');
    console.log('MX Records:');
    console.log('Type: MX');
    console.log('Host: @');
    console.log('Priority: 10');
    console.log('Value: mx1.improvmx.com');
    console.log('TTL: 300\n');
    console.log('Type: MX');
    console.log('Host: @');
    console.log('Priority: 20');
    console.log('Value: mx2.improvmx.com');
    console.log('TTL: 300\n');

    console.log('SPF Record:');
    console.log('Type: TXT');
    console.log('Host: @');
    console.log('Value: "v=spf1 include:spf.improvmx.com ~all"');
    console.log('TTL: 300\n');

    console.log('Domain Status:', domain.active ? '✅ Active' : '❌ Inactive');
    console.log('DKIM Selector:', domain.dkim_selector);
    console.log('Added:', new Date(domain.added).toLocaleString());
    console.log('Strict MX:', domain.strict_mxes ? 'Yes' : 'No');

  } catch (error: any) {
    console.error('Failed to fetch domain settings:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });
  }
}

getDKIMSettings().catch(console.error); 