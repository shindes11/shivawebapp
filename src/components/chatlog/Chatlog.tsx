'use client';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import SuggestedPrompts from '@/components/SuggestedPrompts';
import MessageList from '@/components/MessageList';
import { useMembership } from '../chat/pages/useMembership';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatLog({ token, sessionId }: { token: string; sessionId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { oldestTenantId, oldestUserId } = useMembership();
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  console.log('sessionId:', sessionId);
  console.log('oldestUserId:', oldestUserId);

  // Ref for scrolling to last message
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchChatHistory = async (sessionId: string) => {
    if (!token || !sessionId) {
      console.error('Missing JWT token or sessionId');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://v2api.humac.live/api/rest/getdatabysessionid?sessionId=${sessionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error fetching chat history: ${response.statusText}`);
      }

      const data = await response.json();

      // Ensure the response contains the expected structure
      if (data.shivachat_chatlog && Array.isArray(data.shivachat_chatlog)) {
        const chatHistory = data.shivachat_chatlog.map((item: any, index: number) => [
          {
            id: `question-${item.id || index}-${Date.now()}`,
            role: 'user',
            content: item.question,
          },
          {
            id: `answer-${item.id || index}-${Date.now()}`,
            role: 'assistant',
            content: item.answer,
          },
        ]).flat();

        setMessages(chatHistory);
      } else {
        console.error('Unexpected API response structure:', data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateMessage = (id: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, content: newContent } : msg,
      ),
    );
  };

  useEffect(() => {
    if (sessionId) {
      setIsLoading(true);
      fetchChatHistory(sessionId);
    }
  }, [sessionId]);


  useLayoutEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box>
      <Flex direction="column" maxW="3xl" mx="auto" pb="60px">
        <Box flex="1" display="flex" justifyContent="center" alignItems="center" minH="400px">
          {isLoading ? (
            <Flex direction="column" alignItems="center">
              <Spinner size="xl" />
              <Text mt={4} fontSize="lg" color="gray.500">
                Loading chat history...
              </Text>
            </Flex>
          ) : messages.length === 0 ? (
            <Text mt={4} fontSize="lg" color="gray.500">
              No messages found for this session.
            </Text>
          ) : (
            <Box
              width="100%"
              maxH="500px"
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for WebKit browsers
                '-ms-overflow-style': 'none',  // Hide scrollbar for IE and Edge
                'scrollbar-width': 'none',     // Hide scrollbar for Firefox
              }}
            >
              <MessageList
                messages={messages ?? []}
                isLoading={isLoading}
                onUpdateMessage={onUpdateMessage}
              />

              <div ref={messagesEndRef} />
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
