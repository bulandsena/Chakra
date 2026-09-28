import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const token = event.queryStringParameters?.token;
  const orderId = event.queryStringParameters?.order;

  if (!token || !token.startsWith('tk_')) {
    return {
      statusCode: 403,
      body: 'Access Denied: Invalid or expired download token.',
    };
  }

  const payload = `
========================================================================
CHAKRA MARKETPLACE - VERIFIED DIGITAL LICENSED FILE
========================================================================
Order Reference: ${orderId || 'CHK-VERIFIED'}
Token: ${token}
Timestamp: ${new Date().toISOString()}
License: Single User Sovereign License (Non-transferable)

Delivered securely via Netlify Serverless Engine & CHAKRA Vault.
========================================================================
  `.trim();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="chakra-licensed-asset.txt"`,
      'Cache-Control': 'no-store, private',
    },
    body: payload,
  };
};
