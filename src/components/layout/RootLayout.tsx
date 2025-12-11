'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Portal, useDisclosure } from '@chakra-ui/react';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname, useRouter } from 'next/navigation';
import '@/styles/App.css';
import routes from '@/routes';
import AppWrappers from '@/app/AppWrappers';
import { TokenProvider } from '@/lib/TokenContext';

export default function RootLayout({
  children,
  token,
}: Readonly<{ children: ReactNode; token: any }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const { onOpen } = useDisclosure();
  const [isCollapsed, setIsCollapsed] = useState(false); // Moved state here
  const [sessionIds, setSessionIds] = useState<string[]>([]); // State for session IDs

  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
  }, [apiKey]);

  useEffect(() => {

    if (typeof token === undefined || !token) {
    
      router.push('/auth/login'); // Redirect to sign-in page
    } else if (typeof token !== undefined && pathname?.includes('auth/login')) {
      router.push('/');
    } else {
     
      setLoading(false); // Set loading to false only if the token is valid
    }
  }, [token, router, pathname]);

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

  const toggleCollapse = () => setIsCollapsed(!isCollapsed); 
  const handleSessionSelect = (sessionId: string) => {
    console.log(`Selected session: ${sessionId}`);
    // Navigate to the dynamic chat session page
    router.push(`/chat/${sessionId}`);
  };

  return (
    <TokenProvider token={token}>
      <AppWrappers>
        {pathname?.includes('register') || pathname?.includes('auth/login')
          ? children
          : typeof token !== 'undefined' &&
            token && ( // Render the dashboard only if the token is present and valid
              <Box>
                <Sidebar
                  token={token}  
                  routes={routes}
                  onSessionSelect={handleSessionSelect} // Pass session selection handler
                  isCollapsed={isCollapsed} // Pass isCollapsed as prop
                  toggleCollapse={toggleCollapse} // Pass toggle function
                />

                <Box
                  pt={{ base: '30px', md: '40px' }}
                  float="right"
                  position="relative"
                  w={{ base: '100%', xl: isCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 290px)' }} // Adjust width based on collapse state
                  maxWidth={{ base: '100%', xl: isCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 290px)' }}
                  transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                  transitionDuration=".2s, .2s, .35s"
                  transitionProperty="top, bottom, width"
                  transitionTimingFunction="linear, linear, ease"
                >
                  <Portal>
                    <Box>
                      <Navbar
                        setApiKey={setApiKey}
                        onOpen={onOpen}
                        logoText={'Horizon UI Dashboard PRO'}
                        brandText={getActiveRoute(routes, pathname)}
                        secondary={getActiveNavbar(routes, pathname)}
                      />
                    </Box>
                  </Portal>
                  <Box
                    mx="auto"
                    p={{ base: '20px', md: '30px' }}
                    pe="20px"
                    pt="50px"
                  >
                    {children}
                  </Box>
                </Box>
              </Box>
            )}
      </AppWrappers>
    </TokenProvider>
  );
}
