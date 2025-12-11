'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Text,
  Button,
} from '@chakra-ui/react';
import Content from '@/components/sidebar/components/Content';
import {
  renderThumb,
  renderTrack,
  renderView,
} from '@/components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { IoMenuOutline } from 'react-icons/io5';
import { IRoute } from '@/types/navigation';
import { isWindowAvailable } from '@/utils/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { BsArrowsCollapseVertical } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import Brand from './components/Brand';
import { HumacLogo } from '../icons/Icons';
import { FaPlus } from 'react-icons/fa';

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
  onSessionSelect: (sessionId: string) => void; // Callback for session selection
  isCollapsed: boolean; // Add prop for collapse state
  toggleCollapse: () => void; // Add prop for collapse toggle function
  token: string;
}

function Sidebar(props: SidebarProps) {
  const { routes, setApiKey, onSessionSelect, isCollapsed, toggleCollapse, token } = props; // Use passed props
  const [questions, setQuestions] = useState<{ question: string; sessionId: string }[]>([]);
  const variantChange = '0.2s linear';
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  const sidebarBg = useColorModeValue('#fdfeff', 'gray.700');
  const sidebarWidth = isCollapsed ? '80px' : '250px';
  const router = useRouter(); // Use router for navigation
  //https://v2api.humac.live/api/rest/shivachat-chatlog

  useEffect(() => {
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

        // Ensure the response contains the expected structure
        if (data.shivachat_chatlog && Array.isArray(data.shivachat_chatlog)) {
          const extractedQuestions = data.shivachat_chatlog
            .filter((session: any) => session.sessionid !== null) // Filter out null session IDs
            .map((session: any) => ({
              question: session.question || 'No question available',
              sessionId: session.sessionid,
            }));
          setQuestions(extractedQuestions);
        } else {
          console.error('Unexpected API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching session IDs:', error);
      }
    };

    fetchSessionIds();
  }, [token]);

  console.log("Questions with Session IDs:", questions); // Corrected variable name

  return (
    <Box
      display={{ base: 'none', xl: 'block' }}
      position="fixed"
      minH="100%"
      transition={variantChange}
    >
      <Box
        bg={sidebarBg}
        w={sidebarWidth}
        h="100vh"
        overflow="hidden"
        boxShadow={shadow}
        transition="width 0.3s"
      >
        <Flex px="auto">
          <HumacLogo isCollapsed={isCollapsed} />

        </Flex>
        <Flex alignItems={"end"} justifyContent={"end"}> <IconButton
          aria-label="New Chat"
          icon={<FaPlus />} // Replace with your desired icon
          onClick={() => router.push('/')} // Redirect to the default landing page
          variant="ghost"
          colorScheme="blue"
          size="lg"
        />
          <IconButton
            aria-label="Toggle Sidebar"
            icon={<ChevronLeftIcon />}
            onClick={toggleCollapse} // Use toggle function passed as prop
            variant="ghost"
          /></Flex>

        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          {!isCollapsed && (
            <Box mt="4" px="4">
              <Text fontSize="sm" fontWeight="bold" mb="2">
                Chat History
              </Text>
              {questions.map(({ question, sessionId }, index) => (
                <Box
                  key={index}
                  p="2"
                  // bg="gray.100"
                  borderRadius="md"
                  mb="2"
                  cursor="pointer"
                  _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                  onClick={() => sessionId && onSessionSelect(sessionId)}
                >
                  <Text fontSize="sm" >
                    {question || 'No question available'}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props: Readonly<{ routes: IRoute[] }>) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { routes } = props;
  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={
          isWindowAvailable() && document.documentElement.dir === 'rtl'
            ? 'right'
            : 'left'
        }
      >
        <DrawerOverlay />
        <DrawerContent
          w="285px"
          maxW="285px"
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton
            zIndex="3"
            onClick={onClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Sidebar;
