import React, { useState, useRef } from 'react';
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { User, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { HumacIcon } from './icons/Icons';
import { FaRegCopy, FaEdit, FaSave } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa6';
interface Message {
  id: string;
  content: string;
  role: 'user' | 'ai';
}

interface MessageItemProps {
  message: Message;
  onUpdateMessage: (id: string, newContent: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onUpdateMessage,
}) => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(message.content);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userMsgBg = useColorModeValue('gray.200', 'gray.700');
  const aiMsgBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const sidebarBg = useColorModeValue('#fdfeff', 'gray.700');
  const codeBg = useColorModeValue('gray.200', 'gray.700');

  const fetchAudio = async (text: string) => {
    try {
      const response = await fetch(
        'https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1',
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': '1fd30ace63c14217b177faca4fc66f66',
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
          },
          body: `
          <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
            <voice name="en-US-AndrewNeural">
              ${text}
            </voice>
          </speak>
        `,
        },
      );

      if (!response.ok) {
        throw new Error(`Error fetching audio: ${response.statusText}`);
      }

      const responseBlob = await response.blob();
      const audioUrl = URL.createObjectURL(responseBlob);

      setAudioUrl(audioUrl);
      return audioUrl;
    } catch (error) {
      console.error('Error fetching audio:', error);
      return '';
    }
  };

  const handlePlayAudio = async () => {
    if (!audioUrl) {
      const url = await fetchAudio(message.content);
      if (url && audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Hide the copied message after 2 seconds
      })
      .catch((error) => {
        console.error('Error copying content:', error);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateMessage(message.id, editedContent);
    setIsEditing(false);
  };

  return (
    <Flex
      direction={message.role === 'user' ? 'row-reverse' : 'row'}
      align="flex-start"
      mb={2}
    >
      {message.role === 'user' ? (
        <Icon
          as={User}
          // boxSize={6}
          color={message.role === 'user' ? 'blue.500' : 'purple.500'}
          mt={1}
        />
      ) : (
        <div>
          {' '}
          <HumacIcon />
        </div>
      )}

      <Box
        ml={2}
        p={3}
        borderRadius="lg"
        paddingLeft={message.role === 'user' ? 3 : 10}
        bg={message.role === 'user' ? userMsgBg : aiMsgBg}
        color={message.role === 'user' ? 'inherit' : 'inherit'}
        borderWidth={message.role === 'user' ? 1 : 0} // Remove border for AI messages
        borderColor={message.role === 'user' ? borderColor : 'transparent'}
        // maxWidth="75%"
        wordBreak="break-word"
      >
        {message.role !== 'user' && (
          <Flex>
            <Button size="sm" onClick={handlePlayAudio}>
              {isPlaying ? <FaPause /> : <Volume2 />}
            </Button>
            {copied ? (
              <Text fontSize="sm" color="green.500" mt="2">
                Copied!
              </Text>
            ) : (
              <Button size="sm" onClick={handleCopyContent}>
                <FaRegCopy />
              </Button>
            )}
          </Flex>
        )}

        {message.role === 'user' && isEditing && (
          <Button size="sm" onClick={handleSave}>
            <FaSave />
          </Button>
        )}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
        {isEditing ? (
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <div>
            {' '}
            <ReactMarkdown
              components={{
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: '30px', marginBottom: '10px' }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ paddingLeft: '30px', marginBottom: '10px' }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: '10px' }}>{children}</li>
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return (
                      <Box
                        as="code"
                        px="1"
                        py="0.5"
                        borderRadius="md"
                        fontSize="sm"
                        backgroundColor={codeBg} // Apply sidebar background
                        {...props}
                      >
                        {children}
                      </Box>
                    );
                  }
                  return (
                    <Box
                      as="pre"
                      backgroundColor={codeBg} // Apply sidebar background
                      color="inherit" // Keep text color adaptive
                      p="3"
                      borderRadius="md"
                      overflowX="auto"
                      my="2"
                      fontSize="sm"
                      whiteSpace="pre-wrap"
                      {...props}
                    >
                      {children}
                    </Box>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </Box>
    </Flex>
  );
};

export default MessageItem;
