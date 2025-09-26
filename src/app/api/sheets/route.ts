import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  if (!GOOGLE_SCRIPT_URL) {
    return NextResponse.json({ error: 'Google Script URL not configured' }, { status: 500 });
  }

  try {
    const url = `${GOOGLE_SCRIPT_URL}?action=check&username=${encodeURIComponent(username)}`;
    console.log('Checking user with URL:', url);
    
    const response = await fetch(url);
    const text = await response.text();
    console.log('Raw response:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.log('Response is not JSON, treating as not found');
      data = { exists: false };
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json({ error: 'Failed to check user', exists: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, prize } = await request.json();
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (!GOOGLE_SCRIPT_URL) {
      return NextResponse.json({ error: 'Google Script URL not configured' }, { status: 500 });
    }

    const timestamp = new Date().toISOString();
    
    console.log('Sending to Google Sheets:', { timestamp, username, prize });

    // Try GET request with URL parameters (most common for Google Apps Script)
    const params = new URLSearchParams({
      timestamp,
      username,
      prize: prize || 'Unknown'
    });

    const getUrl = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    console.log('GET URL:', getUrl);

    let response = await fetch(getUrl);
    let text = await response.text();
    console.log('GET Response:', text);

    // If GET doesn't work, try POST with form data
    if (!response.ok || text.includes('error')) {
      console.log('Trying POST method...');
      const formData = new URLSearchParams();
      formData.append('timestamp', timestamp);
      formData.append('username', username);
      formData.append('prize', prize || 'Unknown');

      response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      text = await response.text();
      console.log('POST Response:', text);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // If response is not JSON, assume success if no error in text
      if (text.toLowerCase().includes('error')) {
        data = { success: false, error: text };
      } else {
        data = { success: true, message: 'Data submitted successfully' };
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}