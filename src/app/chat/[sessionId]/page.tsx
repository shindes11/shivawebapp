'use client';
import React from 'react';
import ChatLog from '@/components/chatlog/Chatlog';
import { useParams } from 'next/navigation';
import { useToken } from '@/lib/TokenContext'; // Import token from context

export default function ChatSessionPage() {
  const params = useParams(); // Retrieve params object
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId; // Ensure sessionId is a string
  const token = useToken(); // Retrieve token from context

  if (!token || typeof token !== 'string') {
    return <p>Token is missing or invalid. Please log in again.</p>; // Handle missing or invalid token gracefully
  }

  if (!sessionId) {
    return <p>Session ID is missing.</p>; // Handle missing sessionId gracefully
  }

  return <ChatLog token={token} sessionId={sessionId} />;
}
