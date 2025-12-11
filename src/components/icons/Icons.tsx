'use client';

import { Box, Flex, Image, useColorModeValue } from '@chakra-ui/react';

export const HumacLogo = ({ isCollapsed }: any) => {
  const logoSrc = useColorModeValue('/img/SHIVA.png', '/img/SHIVA-light.png');
  const size = isCollapsed ? '50px' : '100px';

  return (
    <Flex
      height={size}
      mx={'auto'} // Center horizontally
      width="100%" // Make the container take full width
      alignItems="center" // Center items vertically
      justifyContent="center" // Center items horizontally
    >
      <Image
        height="100%"
        width="100px"
        onClick={() => {
          window.location.reload();
        }}
        src={logoSrc}
        alt="HUMAC.AI Logo"
      />
    </Flex>
  );
};
export const HumacIcon = () => {
  const logoSrc = useColorModeValue('/img/SHIVA.png', '/img/SHIVA-light.png');

  return (
    <Box height="30px" width="30px">
      <Image
        height="100%"
        width="100%"
        onClick={() => {
          window.location.reload();
        }}
        src={logoSrc}
        alt="HUMAC.AI Logo"
      />
    </Box>
  );
};

export const SignInPageLogo = () => {
  const logoSrc = useColorModeValue('/img/SHIVA.png', '/img/SHIVA-light.png');

  return (
    <Box height="300px" width="300px">
      <Image
        height="100%"
        width="100%"
        onClick={() => {
          window.location.reload();
        }}
        src={logoSrc}
        alt="HUMAC.AI Logo"
      />
    </Box>
  );
};

export const HumacNameLogo = () => {
  const logoSrc = useColorModeValue(
    '/img/HUMAC.AI-Logo-01.png',
    '/img/Humac1.png',
  );

  return (
    <Box height="120px" paddingBottom="20px">
      <Image
        height="100%"
        width="100%"
        onClick={() => {
          window.location.reload();
        }}
        src={logoSrc}
        alt="HUMAC.AI Logo"
      />
    </Box>
  );
};
