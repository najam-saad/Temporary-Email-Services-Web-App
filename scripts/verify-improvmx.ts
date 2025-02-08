import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifySetup() {
  const API_KEY = process.env.IMPROVMX_API_KEY;
  const DOMAIN = process.env.DOMAIN;
  const EMAIL_USER = process.env.EMAIL_USER;

  console.log('Configuration:', {
    hasApiKey: !!API_KEY,
    domain: DOMAIN,
    forwardTo: EMAIL_USER
  });

  const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

  try {
    // Test API access
    console.log('\nTesting API access...');
    const domainResponse = await axios.get(
      'https://api.improvmx.com/v3/domains',
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    );
    console.log('API access successful:', domainResponse.data);

    // Test domain setup
    console.log('\nChecking domain setup...');
    const domainInfoResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    );
    console.log('Domain info:', domainInfoResponse.data);

    // List existing aliases
    console.log('\nListing existing aliases...');
    const aliasesResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    );
    console.log('Existing aliases:', aliasesResponse.data);

  } catch (error: any) {
    console.error('Verification failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

verifySetup(); 