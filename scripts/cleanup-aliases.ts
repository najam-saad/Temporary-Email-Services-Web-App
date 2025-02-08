import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function cleanupAliases() {
  const API_KEY = process.env.IMPROVMX_API_KEY;
  const DOMAIN = process.env.DOMAIN;
  const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

  try {
    const response = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    );

    const aliases = response.data.aliases;
    console.log(`Found ${aliases.length} aliases`);

    for (const alias of aliases) {
      console.log(`Deleting alias: ${alias.alias}`);
      await axios.delete(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases/${alias.alias}`,
        {
          headers: {
            'Authorization': `Basic ${authHeader}`
          }
        }
      );
    }

    console.log('Cleanup complete');
  } catch (error: any) {
    console.error('Cleanup failed:', error.response?.data || error.message);
  }
}

cleanupAliases(); 