'use client';
/* eslint-disable */
// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import AdminNavbarLinks from './NavbarLinksAdmin';
import { isWindowAvailable } from '@/utils/navigation';
import Greeting from '@/components/Greeting';

interface Membership {
  firstName: string;
  lastName: string;
  createdAt: string; // Assuming the createdAt is returned as a string
}
export default function AdminNavbar(props: {
  secondary: boolean;
  brandText: string;
  logoText: string;
  onOpen: (...args: any[]) => any;
  setApiKey: any;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    isWindowAvailable() && window.addEventListener('scroll', changeNavbar);

    return () => {
      isWindowAvailable() && window.removeEventListener('scroll', changeNavbar);
    };
  });

  const { secondary, brandText, setApiKey } = props;
  const [oldestMemberName, setOldestMemberName] = useState<string | null>(null);

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue('white', 'navy.700');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarPosition = 'fixed' as const;
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';
  let navbarShadow = 'none';
  let navbarBg = useColorModeValue(
    'rgba(244, 247, 254, 0.2)',
    'rgba(11,20,55,0.5)',
  );
  let navbarBorder = 'transparent';

  let gap = '0px';
  const changeNavbar = () => {
    if (isWindowAvailable() && window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const response = await fetch('/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        });

        if (response.ok) {
          const userData = await response.json();

          // Assuming the response includes a 'memberships' array with firstName, lastName, and createdAt
          const memberships: Membership[] = userData.memberships;

          // Sort memberships by createdAt date in ascending order (oldest first)
          memberships.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );

          // Get the oldest membership
          const oldestMembership = memberships[0];

          // Set the name of the oldest member
          if (oldestMembership) {
            setOldestMemberName(
              `${oldestMembership.firstName} ${oldestMembership.lastName}`,
            );
          }
        } else {
          console.error('Failed to fetch user memberships');
        }
      } catch (error) {
        console.error('Error fetching membership data:', error);
      }
    };

    fetchMembershipData();
  }, []);

  return (
    <Box position="relative">
      <Flex
        position="absolute"
        top="0"
        // m="4"
        // p="2"
        borderRadius="md"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        mx="auto"
        
        // mt={secondaryMargin}
        // pb="8px"
        right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
        px={{
          base: '8px',
          md: '10px',
        }}
        ps={{
          base: '8px',
          md: '12px',
        }}
        pt="8px"
        // top={{ base: '12px', md: '16px', xl: '18px' }}
        w={{
          base: 'calc(100vw - 8%)',
          md: 'calc(100vw - 8%)',
          lg: 'calc(100vw - 6%)',
          xl: 'calc(100vw - 350px)',
          '2xl': 'calc(100vw - 365px)',
        }}
      >
        Shiva
        <AdminNavbarLinks
          oldestMemberName={oldestMemberName}
          secondary={props.secondary}
        />
      </Flex>
    </Box>
  );
}
