import axios from 'axios';

const BASE_URL = 'https://67a6e15d2e8776830d7e9a3c--deluxe-gumdrop-48056b.netlify.app';
const API_URL = `${BASE_URL}/api`;

async function checkSite() {
  console.log('🔍 Checking site accessibility...\n');

  // Check main site
  try {
    console.log(`Testing ${BASE_URL}...`);
    const siteResponse = await axios.get(BASE_URL);
    console.log('✅ Main site accessible');
  } catch (error: any) {
    console.log('❌ Main site error:', error.message);
  }

  // Check API endpoint
  try {
    console.log(`\nTesting ${API_URL}...`);
    const apiResponse = await axios.get(API_URL);
    console.log('✅ API endpoint accessible');
    console.log('Response:', apiResponse.data);
  } catch (error: any) {
    console.log('❌ API error:', error.message);
    if (error.response) {
      console.log('Response:', error.response.data);
    }
  }
}

checkSite().catch(console.error); 