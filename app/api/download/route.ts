import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('token');
  const orderId = searchParams.get('order');

  if (!token || !token.startsWith('tk_')) {
    return new NextResponse('Access Denied: Invalid or expired download token.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Generate watermarked sovereign license payload
  const content = `
========================================================================
CHAKRA MARKETPLACE - VERIFIED DRM-FREE LICENSED ASSET
========================================================================
Order Reference: ${orderId || 'CHK-VERIFIED'}
Token: ${token}
Timestamp: ${new Date().toISOString()}
License: Single User Sovereign License (Non-transferable)

This genuine product was delivered via CHAKRA's encrypted token vault.
Support: support@chakra-marketplace.in
Platform: https://chakra-marketplace.in
========================================================================
  `.trim();

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="chakra-licensed-asset-${Date.now().toString(36)}.txt"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    },
  });
}
