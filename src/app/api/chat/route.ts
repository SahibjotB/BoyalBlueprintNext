 import { NextRequest, NextResponse } from 'next/server';

// Example POST handler for chat requests
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json(); // Expect a JSON body with a 'message' field

    const response = `AI Response to: "${message}"`; // Simulate a reply

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Other methods at this endpoint
export async function GET() {
  return NextResponse.json({ message: 'Chat API is running' });
}