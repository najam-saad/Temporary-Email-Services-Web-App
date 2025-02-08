import axios from 'axios';

// List of possible URLs to try
const urls = [
  'https://deluxe-gumdrop-48056b.netlify.app',
  'https://deluxe-gumdrop-48056b.netlify.app/api',
  'https://tempfreeemail.com',
  'https://tempfreeemail.com/api'
];

async function checkDeployment() {
  console.log('🔍 Checking deployment URLs...\n');

  for (const url of urls) {
    try {
      console.log(`Testing ${url}...`);
      const response = await axios.get(url);
      console.log(`✅ Success! Status: ${response.status}`);
      console.log('Response:', response.data);
    } catch (error: any) {
      console.log(`❌ Failed! ${error.message}`);
      if (error.response) {
        console.log('Response:', error.response.data);
      }
    }
    console.log('\n---\n');
  }
}

checkDeployment().catch(console.error); 