import { NextRequest, NextResponse } from 'next/server';

// Simulate real network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { transactionId, amount, currency } = body;

  if (!transactionId || !amount || !currency) {
    return NextResponse.json(
      { success: false, status: 'failed', failureReason: 'Invalid request payload' },
      { status: 400 }
    );
  }

  // Roll the dice — 60% success, 25% fail, 15% timeout
  const random = Math.random();

  if (random < 0.15) {
    // Timeout simulation — responds after 8s
    // Frontend will abort after 6s, so this never actually resolves for the client
    await sleep(8000);
    return NextResponse.json({
      success: false,
      transactionId,
      status: 'failed',
      failureReason: 'Gateway timeout',
    });
  }

  if (random < 0.40) {
    // 25% failure (0.15 to 0.40)
    await sleep(1500); // Simulate processing time
    const reasons = [
      'Insufficient funds',
      'Card declined by issuer',
      'Invalid card details',
      'Transaction limit exceeded',
    ];
    const failureReason = reasons[Math.floor(Math.random() * reasons.length)];

    return NextResponse.json({
      success: false,
      transactionId,
      status: 'failed',
      failureReason,
    });
  }

  // 60% success
  await sleep(1500);
  return NextResponse.json({
    success: true,
    transactionId,
    status: 'success',
  });
}