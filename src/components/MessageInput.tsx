import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Box,
  Flex,
  IconButton,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Mic, Send, Loader2 } from 'lucide-react';
import EVEBotTracker from '@/components/EVEBotTracker';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [visualizerData, setVisualizerData] = useState(Array(100).fill(0));

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await onSendMessage(input);
    setInput('');
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setInput(transcript);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = window.setTimeout(() => {
        recognition.stop();
      }, 3000); // Stop after 3 seconds of silence
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const handleMicClick = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      stopVisualizer();
    } else {
      recognitionRef.current?.start();
      startVisualizer();
    }
  };

  const startVisualizer = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamSourceRef.current =
      audioContextRef.current.createMediaStreamSource(stream);

    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    mediaStreamSourceRef.current.connect(analyserRef.current);

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteTimeDomainData(dataArray);

      const rms = Math.sqrt(
        dataArray.reduce((sum, value) => sum + (value - 128) ** 2, 0) /
          dataArray.length,
      );
      const normalizedRMS = Math.min(1, rms / 128);

      setVisualizerData((prevData) => {
        const newData = [...prevData.slice(1), normalizedRMS];
        return newData;
      });

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const stopVisualizer = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }

    setVisualizerData(Array(100).fill(0));
  };

  return (
    <Flex mt="auto" direction={'column'} justify={'end'}>
      <Box position={'sticky'}>
        <Flex alignItems="center" p={4} borderRadius="md">
          <EVEBotTracker size={50} />
          <Flex
            as="form"
            onSubmit={handleSubmit}
            flex="1"
            alignItems="center"
            ml={4}
          >
            <Box position="relative" flex="1">
              <Input
                value={input}
                color={useColorModeValue('black', 'white')}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message"
                pr="50px"
                isDisabled={isLoading}
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="full"
                boxShadow="sm"
              />
              {isListening && (
                <Flex
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  pointerEvents="none"
                >
                  {visualizerData.map((value, index) => (
                    <Box
                      key={index}
                      height={`${Math.min(100, Math.max(10, value * 100))}%`}
                      width="2px"
                      backgroundColor={isListening ? 'blue' : 'gray'}
                      mx="1px"
                      alignSelf="flex-end"
                    />
                  ))}
                </Flex>
              )}
              <IconButton
                aria-label="Mic"
                icon={
                  <Mic
                    height="20px"
                    width="20px"
                    color={useColorModeValue('black', 'white')}
                  />
                }
                onClick={handleMicClick}
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                isActive={isListening}
                isDisabled={isLoading}
                bg="transparent"
                _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
                _active={{ bg: useColorModeValue('gray.300', 'gray.600') }}
                borderRadius="50%"
                boxShadow="md"
                size="sm"
              />
            </Box>
            <Button
              type="submit"
              isDisabled={isLoading}
              ml={2}
              bgGradient="linear(to-r, teal.500, green.500)" // Gradient background
              color="white"
              borderRadius="full"
              boxShadow="sm"
              size="sm"
              p={2}
              minW="auto"
              _hover={{ bgGradient: "linear(to-r, teal.600, green.600)" }} // Darker gradient on hover
              _active={{ bgGradient: "linear(to-r, teal.700, green.700)" }} // Even darker gradient on active
            >
              {isLoading ? <Loader2 /> : <Send size={16} />}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MessageInput;
