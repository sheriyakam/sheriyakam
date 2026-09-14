import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { packType, provider } = await req.json();
    const amount = packType === 'active_search' ? 5 : (packType === 'lite' ? 2 : 0);

    return NextResponse.json({
      success: true,
      orderId: 'ord_' + Date.now(),
      amount,
      currency: 'USD',
      provider: provider || 'stripe',
      checkoutUrl: 'https://checkout.stripe.com/pay/mock_session_' + Date.now()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
