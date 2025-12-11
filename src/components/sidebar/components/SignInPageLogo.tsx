'use client';

import { Box, Image, useColorModeValue } from '@chakra-ui/react';

export const SignInPageLogo = () => {
  const logoSrc = useColorModeValue('/img/SHIVA.png', '/img/SHIVA.png');

  return (
    <Box height="400px" width="400px">
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
export const HumacIcon = () => {
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
