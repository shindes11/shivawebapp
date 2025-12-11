import React from 'react';
import ChatLog from './Chatlog';
import { TokenProvider } from '@/lib/TokenContext';
import { cookies } from 'next/headers';
import { cookieGet } from '@/lib/cookie';

export default function ChatlogMain() {
  const token = cookieGet(cookies(), 'token');
  return (
    <div>
      {' '}
      <TokenProvider token={token}>
        <ChatLog token={token} />
      </TokenProvider>
    </div>
  );
}
