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
  Collapse,
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
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { BsArrowsCollapseVertical } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import Brand from './components/Brand';
import { HumacLogo } from '../icons/Icons';
import { FaPlus } from 'react-icons/fa';
import { groupChatsByDate, formatDateForDisplay, ChatSession, GroupedChats } from '@/utils/chatUtils';
import { useMembership } from '@/components/chat/pages/useMembership';

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
  const { oldestUserId } = useMembership(); // Get current user's ID
  const [groupedChats, setGroupedChats] = useState<GroupedChats>({});
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const variantChange = '0.2s linear';
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  const sidebarBg = useColorModeValue('#fdfeff', 'gray.700');
  const sidebarWidth = isCollapsed ? '80px' : '250px';
  const router = useRouter(); // Use router for navigation
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dateHeaderBg = useColorModeValue('gray.50', 'gray.800');
  //https://v2api.humac.live/api/rest/shivachat-chatlog

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!token) {
        console.error('Missing JWT token');
        return;
      }

      // Wait for userId to be available
      if (!oldestUserId) {
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
          throw new Error(`Error fetching chat history: ${response.statusText}`);
        }

        const data = await response.json();

        // Ensure the response contains the expected structure
        if (data.shivachat_chatlog && Array.isArray(data.shivachat_chatlog)) {
          // Filter by userId first - only show chats belonging to the current user
          const userChats = data.shivachat_chatlog.filter((item: any) => {
            return item.userId === oldestUserId;
          });

          // Group sessions by sessionId to get unique sessions with their first question
          const sessionMap = new Map<string, ChatSession>();
          
          userChats.forEach((item: any) => {
            if (item.sessionid !== null && item.sessionid !== undefined) {
              const sessionId = item.sessionid;
              
              // If this session doesn't exist yet, or if we want to use the chatname if available
              if (!sessionMap.has(sessionId)) {
                sessionMap.set(sessionId, {
                  sessionId: sessionId,
                  question: item.question || 'New Chat',
                  chatname: item.chatname || item.question || 'New Chat',
                  date: item.date || new Date().toISOString().split('T')[0],
                });
              } else {
                // Update if chatname is available and current one doesn't have it
                const existing = sessionMap.get(sessionId)!;
                if (item.chatname && !existing.chatname) {
                  existing.chatname = item.chatname;
                }
                // Use the first question if available
                if (item.question && existing.question === 'New Chat') {
                  existing.question = item.question;
                }
              }
            }
          });

          const sessions: ChatSession[] = Array.from(sessionMap.values());
          const grouped = groupChatsByDate(sessions);
          setGroupedChats(grouped);
          
          // Expand all dates by default
          setExpandedDates(new Set(Object.keys(grouped)));
        } else {
          console.error('Unexpected API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [token, oldestUserId]);

  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

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
            <Box mt="4" px="2">
              <Text fontSize="sm" fontWeight="bold" mb="3" px="2">
                Chat History
              </Text>
              {Object.keys(groupedChats).length === 0 ? (
                <Text fontSize="xs" color="gray.500" px="2" py="4">
                  No chat history yet
                </Text>
              ) : (
                Object.entries(groupedChats).map(([date, sessions]) => {
                  const isExpanded = expandedDates.has(date);
                  const displayDate = formatDateForDisplay(date);
                  
                  return (
                    <Box key={date} mb="2">
                      {/* Date Header */}
                      <Flex
                        align="center"
                        justify="space-between"
                        px="2"
                        py="1.5"
                        borderRadius="md"
                        bg={dateHeaderBg}
                        cursor="pointer"
                        onClick={() => toggleDateExpansion(date)}
                        _hover={{ bg: hoverBg }}
                        mb="1"
                      >
                        <Text fontSize="xs" fontWeight="semibold" color="gray.600">
                          {displayDate}
                        </Text>
                        <Icon
                          as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                          w="4"
                          h="4"
                          color="gray.500"
                        />
                      </Flex>
                      
                      {/* Sessions under this date */}
                      <Collapse in={isExpanded} animateOpacity>
                        <Box pl="2">
                          {sessions.map((session) => {
                            const conversationName = session.chatname || session.question || 'New Chat';
                            return (
                              <Box
                                key={session.sessionId}
                                p="2"
                                borderRadius="md"
                                mb="1"
                                cursor="pointer"
                                _hover={{ bg: hoverBg }}
                                onClick={() => session.sessionId && onSessionSelect(session.sessionId)}
                              >
                                <Text fontSize="xs" noOfLines={2} title={conversationName}>
                                  {conversationName}
                                </Text>
                              </Box>
                            );
                          })}
                        </Box>
                      </Collapse>
                    </Box>
                  );
                })
              )}
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
