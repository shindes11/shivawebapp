import React from 'react';
import {
  VStack,
  Flex,
  Box,
  Text,
  useColorModeValue,
  keyframes,
} from '@chakra-ui/react';
import { Loader2 } from 'lucide-react';
import MessageItem from './MessageItem';
import { HumacIcon } from './icons/Icons';

// Define keyframes for spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onUpdateMessage: (id: string, newContent: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onUpdateMessage,
}) => {
  const aiMsgBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <VStack align="stretch" spacing={3}>
      {messages.map((message) => (
        <Box key={message.id}> {/* Added key here */}
          <MessageItem
            message={message as any}
            onUpdateMessage={onUpdateMessage}
          />
        </Box>
      ))}
      {isLoading && (
        <Flex direction="row" align="center" mb={2}>
          <HumacIcon />
          <Box
            ml={2}
            p={3}
            borderRadius="lg"
            bg={aiMsgBg}
            color="inherit"
            borderWidth={1}
            borderColor={borderColor}
            maxWidth="75%"
            display="flex"
            alignItems="center"
            wordBreak="break-word"
            position="relative"
          >
            <Box
              as={Loader2}
              boxSize={5}
              color="gray.500"
              position="absolute"
              left="1rem"
              animation={`${spin} 1s linear infinite`}
            />
            <Text ml="2.5rem">Generating response...</Text>
          </Box>
        </Flex>
      )}
    </VStack>
  );
};

export default MessageList;
