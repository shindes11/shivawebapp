import React from 'react';
import { cookies } from 'next/headers';
import { cookieGet } from '@/lib/cookie';
import ChatMain from '../pages/chatMain';

export default function Chat() {
  const token = cookieGet(cookies(), 'token');
  console.log('Token:', token); // Log the token for debugging
  return (
    <div>
      {/* <ChatMain token={token}/> */}
      <ChatMain token={token}/>
    </div>
  );
}
