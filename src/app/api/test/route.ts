import { handleChat } from '@/lib/services/chatService';
import { insertTestData } from '@/lib/services/database/test';
import { NextRequest, NextResponse } from 'next/server';

// Example POST handler for DB
// export async function POST(request: NextRequest) {
//   try {
//     const data = await request.json(); 
//     console.log("received: " + JSON.stringify(data))
//     console.log(data.id)
//     const response = await insertTestData(data.id, data.name)

//     return NextResponse.json({ response });

//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const data = await request.json(); 
    console.log(data.userQuery);
    const response = await handleChat(data.userQuery);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Other methods at this endpoint
export async function GET() {
  return NextResponse.json({ message: 'hit end point' });
}