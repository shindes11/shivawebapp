import { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function useChat(token: string, oldestTenantId: string | null, oldestUserId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Only log token in development and if it exists
  if (process.env.NODE_ENV === 'development' && token) {
    console.log('TokenB:', token);
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatDate=(date: Date) => {
   const day=String(date.getDate()).padStart(2,'0');
   const month=String(date.getMonth()+1).padStart(2,'0'); // Months are zero-based
   const year=date.getFullYear();
   return `${year}-${month}-${day}`;
  }
  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: message }]);

    try {
      const sessionResponse = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({}),
      });
      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.session_id;

      const formattedInput = {
        input: JSON.stringify({
          query: `${message} token:'${token}'`,
        }),
        session_id: sessionId,
      };

      const payload = {
        ...formattedInput,
        task_id: '1f269592-25dc-4477-a975-a80c1532d17d',
      };

      const taskResponse = await fetch(`/api/tasks/run?session_id=${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const taskData = await taskResponse.json();
      const assistantResponse = taskData;

      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: assistantResponse }]);

      await fetch('https://v2api.humac.live/api/rest/insert-shivachat-chatlog-one', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          object: {
            question: message,
            answer: assistantResponse,
            tenantId: oldestTenantId,
            sessionid: sessionId,
            userId: oldestUserId,
            date:formatDate(new Date()),
            chatname: `Chat-${oldestTenantId || 'Tenant'}-${oldestUserId || 'User'}-${formatDate(new Date())}`,

          },
        }),
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, an error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, messagesEndRef };
}
