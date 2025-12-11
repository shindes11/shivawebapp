import { cookieRemoveAll } from '@/lib/cookie';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(request: NextRequest) {
  let response = NextResponse.json({ ok: true });
  cookieRemoveAll(response.cookies);
  return response;
}
