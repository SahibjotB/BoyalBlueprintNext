 import { handleChat } from '@/lib/services/chatService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json(); 
    console.log(data.userQuery);
    console.log(data.context);
    const response = await handleChat(data.userQuery, data.context);
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Other methods at this endpoint
export async function GET() {
  return NextResponse.json({ message: 'Chat API is running' });
}