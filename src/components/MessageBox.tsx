import ReactMarkdown from 'react-markdown';
import { useColorModeValue } from '@chakra-ui/react';
import Card from '@/components/card/Card';

interface Message {
  role: string;
  content: string;
}

export default function MessageBox(props: { messages?: Message[] }) {
  const { messages = [] } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  return (
    <Card
      display={messages.length > 0 ? 'flex' : 'none'}
      px="22px !important"
      pl="22px !important"
      padding={10}
      color={textColor}
      minH="450px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"
    >
      {messages.map((message, index) => (
        <ReactMarkdown key={index} className="font-medium">
          {message.content}
        </ReactMarkdown>
      ))}
    </Card>
  );
}
