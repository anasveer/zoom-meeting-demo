import { NextRequest, NextResponse } from 'next/server';

interface ZoomMeetingRequest {
  topic: string;
  start_time: string;
  duration: number;
}

interface ZoomMeetingResponse {
  id: number;
  join_url: string;
  start_url: string;
  password?: string;
}

async function getAccessToken() {
  const CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
  const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
  const ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;

  const url = 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' + ACCOUNT_ID;

const response = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization:
      'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    'Content-Type': 'application/json',
  },
});


  const data = await response.json();

  if (!response.ok) {
    console.error('Zoom token error:', data);
    throw new Error(data.message || 'Failed to get access token');
  }

  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body: ZoomMeetingRequest = await req.json();
    const accessToken = await getAccessToken();

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: body.topic || 'Test Meeting',
        type: 2,
        start_time: body.start_time,
        duration: body.duration || 30,
        timezone: 'Asia/Karachi',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Zoom API error:', data);
      return NextResponse.json({ error: data.message || 'Zoom API error' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
