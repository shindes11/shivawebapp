'use client';
import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import MessageInput from '@/components/MessageInput';
import SuggestedPrompts from '@/components/SuggestedPrompts';
import MessageList from '@/components/MessageList';

import { useMembership } from './useMembership';
import { useChat } from './useChat';


export default function ChatMain({ token }: { token: string }) {
  console.log('TokenA:', token); // Log the token for debugging
  const { oldestTenantId, oldestUserId } = useMembership();
  const { messages, isLoading, sendMessage, messagesEndRef } = useChat(
    token,
    oldestTenantId,
    oldestUserId,
  );
  const handleUpdateMessage = (id: string, newContent: string) => {
    console.log(`Updating message ${id} with new content:`, newContent);
  };

  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const fetchSessionIds = async () => {
    if (!token) {
      console.error('Missing JWT token');
      return;
    }

    try {
      const response = await fetch('https://v2api.humac.live/api/rest/shivachat-chatlog', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching session IDs: ${response.statusText}`);
      }

      const data = await response.json();
      const sessions = data.map((session: any) => session.sessionId); // Extract session IDs
      setSessionIds(sessions);
    } catch (error) {
      console.error('Error fetching session IDs:', error);
    }
  };

  useEffect(() => {
    fetchSessionIds();
  }, [token]);

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  return (
    <Box maxW="3xl" mx="auto">
     
      <Flex direction="column" pb="60px">
        <Box flex="1">
          {messages.length === 0 ? (
            <SuggestedPrompts sendMessage={sendMessage} />
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              onUpdateMessage={handleUpdateMessage}
            />
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Flex>
      <Box position="fixed" bottom="0" width="100%">
        <Box width="100%" maxW="3xl">
          <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
        </Box>
      </Box>
    </Box>
  );
}
