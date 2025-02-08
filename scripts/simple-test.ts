import axios from 'axios';

async function simpleTest() {
  try {
    console.log('Starting simple test...');
    const response = await axios.get('https://deluxe-gumdrop-48056b.netlify.app/api');
    console.log('Response:', response.data);
  } catch (error: any) {
    console.error('Test failed:', error.message);
  }
}

simpleTest(); 