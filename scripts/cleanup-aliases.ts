import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface ImprovMXAlias {
  alias: string;
  forward: string;
  id: number;
  created: number;
}

interface ImprovMXResponse {
  aliases: ImprovMXAlias[];
  success: boolean;
}

async function cleanupAliases(): Promise<void> {
  const API_KEY = process.env.IMPROVMX_API_KEY;
  const DOMAIN = process.env.DOMAIN;
  
  if (!API_KEY || !DOMAIN) {
    console.error('Missing required environment variables');
    return;
  }

  const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

  try {
    console.log('Starting cleanup...');
    const response = await axios.get<ImprovMXResponse>(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    );

    const { aliases } = response.data;
    console.log(`Found ${aliases.length} aliases`);

    // Only delete test aliases (those that look like random strings)
    const testAliases = aliases.filter((alias: ImprovMXAlias): boolean => 
      /^[a-z0-9]{6}$/.test(alias.alias)
    );

    console.log(`Found ${testAliases.length} test aliases to delete`);

    for (const alias of testAliases) {
      console.log(`Deleting test alias: ${alias.alias}`);
      try {
        await axios.delete(
          `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases/${alias.alias}`,
          {
            headers: {
              'Authorization': `Basic ${authHeader}`
            }
          }
        );
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (deleteError: any) {
        console.error(`Failed to delete ${alias.alias}:`, deleteError.message);
      }
    }

    console.log('Cleanup complete');
  } catch (error: any) {
    console.error('Cleanup failed:', error.response?.data || error.message);
  }
}

// Execute with error handling
cleanupAliases().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 