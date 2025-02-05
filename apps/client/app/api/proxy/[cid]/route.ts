import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cid: string }> }
) {
  try {
    const { cid } = await params;

    const metadata = await fetch(`https://gateway.shaman.fun/ipfs/${cid}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await metadata.json();

    const code = await fetch(`https://gateway.shaman.fun/ipfs/${data.code}`);

    return NextResponse.json(code, {
      headers: {
        'Content-Type': 'application/typescript',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
