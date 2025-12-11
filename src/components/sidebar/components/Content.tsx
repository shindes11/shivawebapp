'use client';
import {
  Box,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';

import { PropsWithChildren } from 'react';
import { IRoute } from '@/types/navigation';
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';
import packageJson from './../../../../package.json';

// FUNCTIONS

interface SidebarContent extends PropsWithChildren {
  // routes: IRoute[];
  isCollapsed?: any;
  // [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  // const { routes, setApiKey } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const gray = useColorModeValue('gray.500', 'white');

  return (
    <Flex
      // direction="column"
      // height="100%"
      // pt="20px"
      // pb="26px"
      // borderRadius="30px"
      // maxW="285px"
      // px="20px"
    >
      <Brand isCollapsed={props.isCollapsed} />
      {/* <Stack direction="column" mb="auto" mt="8px">
        <Box ps="0px" pe={{ md: '0px', '2xl': '0px' }}>
          <Links routes={routes} isCollapsed={props.isCollapsed} />
        </Box>
      </Stack> */}

      {/* <Box boxShadow={shadowPillBar}>
        <Flex mb={2} alignItems={'center'} justifyContent={'center'}>
          <Text
            color={textColor}
            marginLeft={4}
            fontSize="xx-small"
            fontWeight="600"
          >
            {packageJson.name} ({packageJson.version})
          </Text>
        </Flex>
      </Box> */}
    </Flex>
  );
}

export default SidebarContent;
