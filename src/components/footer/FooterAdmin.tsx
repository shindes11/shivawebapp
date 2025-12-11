'use client';

import {
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  const textColor = useColorModeValue('gray.500', 'white');
  return (
    <Box>
      {/* <List display="flex">
        <ListItem
          me={{
            base: '10px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            href="https://www.parentheses.systems/"
          >
            Homepage
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '10px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            href="#"
          >
            License
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '10px',
            md: '44px',
          }}
        >
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            href="#"
          >
            Terms of Use
          </Link>
        </ListItem>
        <ListItem>
          <Link
            fontWeight="500"
            fontSize={{ base: 'xs', md: 'sm' }}
            color={textColor}
            href="#"
          >
            Privacy Policy
          </Link>
        </ListItem>
      </List> */}
      <Text alignItems={'center'}>
        {' '}
        &copy; {new Date().getFullYear()}
        <Text as="span" fontWeight="500" ms="4px">
          Parentheses Systems Private Limited. All Rights Reserved.
        </Text>
      </Text>
    </Box>
  );
}
