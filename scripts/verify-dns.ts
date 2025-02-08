import dns from 'dns';
import { promisify } from 'util';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const resolveTxt = promisify(dns.resolveTxt);
const resolveMx = promisify(dns.resolveMx);

async function verifyDNS(): Promise<void> {
  const DOMAIN = process.env.DOMAIN;

  if (!DOMAIN) {
    console.error('Missing DOMAIN environment variable');
    return;
  }

  try {
    console.log('Verifying DNS records for', DOMAIN, '\n');

    // Check DKIM
    console.log('Checking DKIM record...');
    const dkimRecords = await resolveTxt(`dkimprovmx._domainkey.${DOMAIN}`);
    console.log('✅ DKIM record found\n');

    // Check DMARC
    console.log('Checking DMARC record...');
    const dmarcRecords = await resolveTxt(`_dmarc.${DOMAIN}`);
    console.log('✅ DMARC record found\n');

    // Check SPF
    console.log('Checking SPF record...');
    const spfRecords = await resolveTxt(DOMAIN);
    const hasSpf = spfRecords.some(record => 
      record[0].includes('v=spf1') && record[0].includes('improvmx.com')
    );
    if (hasSpf) {
      console.log('✅ SPF record found\n');
    } else {
      console.log('❌ SPF record not found or incorrect\n');
    }

    // Check MX
    console.log('Checking MX records...');
    const mxRecords = await resolveMx(DOMAIN);
    const hasMx1 = mxRecords.some(record => 
      record.exchange === 'mx1.improvmx.com' && record.priority === 10
    );
    const hasMx2 = mxRecords.some(record => 
      record.exchange === 'mx2.improvmx.com' && record.priority === 20
    );
    
    if (hasMx1 && hasMx2) {
      console.log('✅ MX records found\n');
    } else {
      console.log('❌ MX records not found or incorrect\n');
    }

  } catch (error: any) {
    console.error('Verification failed:', error.message);
  }
}

verifyDNS().catch(console.error); 