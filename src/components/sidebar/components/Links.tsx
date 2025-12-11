'use client';
/* eslint-disable */

// chakra imports
import {
  Flex,
  HStack,
  Text,
  Box,
  useColorModeValue,
  Badge,
  Link,
} from '@chakra-ui/react';
import { IRoute } from '@/types/navigation';
import NavLink from '@/components/link/NavLink';
import { PropsWithChildren, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[];
  isCollapsed?: any;
}

export function SidebarLinks({ routes, isCollapsed }: SidebarLinksProps) {
  const pathname = usePathname();
  const activeColor = useColorModeValue('navy.700', 'white');
  const inactiveColor = useColorModeValue('gray.500', 'gray.500');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const activeIcon = useColorModeValue('brand.500', 'white');
  const iconColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'gray.500');

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => pathname?.includes(routeName),
    [pathname],
  );

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) =>
    routes.map((route, key) => {
      // if (route.name !== 'SHIVA') {
      //   return null; // Skip other routes and render only SHIVA
      // }
      return (
        <Flex
          key={key}
          align="center"
          justifyContent="space-between"
          w="100%"
          maxW="100%"
          ps="17px"
          mb="0px"
        >
          <HStack
            w="100%"
            mb="14px"
            spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'}
          >
            <NavLink
              href={route.layout ? route.layout + route.path : route.path}
              key={key}
              styles={{ width: '100%' }}
            >
              <Flex w="100%" alignItems="center" justifyContent="center">
                <Box
                  color={
                    route.disabled
                      ? gray
                      : activeRoute(route.path.toLowerCase())
                        ? activeIcon
                        : inactiveColor
                  }
                  me="12px"
                  mt="6px"
                >
                  {route.icon}
                </Box>
                {!isCollapsed ? (
                  <Text
                    me="auto"
                    color={
                      route.disabled
                        ? gray
                        : activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : 'gray.500'
                    }
                    fontWeight="500"
                    letterSpacing="0px"
                    fontSize="sm"
                  >
                    {route.name}
                  </Text>
                ) : null}
              </Flex>
            </NavLink>
          </HStack>
        </Flex>
      );
    });

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
