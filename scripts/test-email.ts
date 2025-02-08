import axios from 'axios';

async function testEmailService() {
  try {
    // Generate email
    const response = await axios.post('http://localhost:3000/api', {
      expireTime: 5
    });
    const { email } = response.data;
    console.log('Generated email:', email);

    // Wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check inbox
    const inboxResponse = await axios.get(`http://localhost:3000/api?email=${email}`);
    console.log('Inbox:', inboxResponse.data);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEmailService(); 