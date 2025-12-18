import React from 'react';
import { cookies } from 'next/headers';
import { cookieGet } from '@/lib/cookie';
import ChatMain from '../pages/chatMain';

export default function Chat() {
  const token = cookieGet(cookies(), 'token');
  // Only log token in development and if it exists
  if (process.env.NODE_ENV === 'development' && token) {
    console.log('Token:', token);
  } else if (process.env.NODE_ENV === 'development' && !token) {
    console.log('Token: Not found - User needs to authenticate');
  }
  return (
    <div>
      {/* <ChatMain token={token}/> */}
      <ChatMain token={token || ''}/>
    </div>
  );
}
