'use client';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';

import { HumacLogo } from '@/components/icons/Icons';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand({ isCollapsed }: any) {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Box >
        <HumacLogo isCollapsed={isCollapsed} />
      </Box>
      {/* <HSeparator mb="20px" w="250px" /> */}
    </Flex>
  );
}

export default SidebarBrand;
