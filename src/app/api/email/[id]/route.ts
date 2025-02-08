import { NextResponse } from 'next/server';
import axios from 'axios';

const DOMAIN = process.env.DOMAIN || 'tempfreeemail.com';
const API_KEY = process.env.IMPROVMX_API_KEY || '';
const authHeader = Buffer.from(`api:${API_KEY}`).toString('base64');

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const response = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/download/${params.id}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json({
      content: response.data,
      success: true
    }, { headers });

  } catch (error: any) {
    console.error('Error fetching email content:', error.response?.data || error.message);
    return NextResponse.json({
      error: "Could not fetch email content",
      details: error.response?.data?.error || error.message
    }, { 
      status: error.response?.status || 500,
      headers 
    });
  }
} 