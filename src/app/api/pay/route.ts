import { NextRequest, NextResponse } from 'next/server';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { transactionId, amount, currency } = body;

  if (!transactionId || amount === undefined || amount === null || !currency) {
    return NextResponse.json(
      { success: false, status: 'failed', failureReason: 'Invalid request payload' },
      { status: 400 }
    );
  }

  const random = Math.random();

  if (random < 0.15) {
    await sleep(8000);
    return NextResponse.json({
      success: false,
      transactionId,
      status: 'failed',
      failureReason: 'Gateway timeout',
    });
  }

  if (random < 0.4) {
    await sleep(1500);
    const reasons = [
      'Insufficient funds',
      'Card declined',
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

  await sleep(1500);
  return NextResponse.json({
    success: true,
    transactionId,
    status: 'success',
  });
}
