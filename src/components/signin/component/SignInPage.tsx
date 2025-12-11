'use client';
import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
  FormErrorMessage,
  Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignInPageLogo } from '@/components/sidebar/components/SignInPageLogo';
import { HumacNameLogo } from '@/components/icons/Icons';

const SignInPage = () => {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue('whiteAlpha.900', 'gray.700');
  const router = useRouter();
  const logoBackground = useColorModeValue('white', 'white');

  // Define schema using Zod
  const schema = z.object({
    contact: z
      .string()
      .min(9, 'Contact number must be at least 9 digits')
      .max(12, 'Contact number must be at most 12 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  // Setup React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      contact: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userResponse = await fetch('/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();

          // Redirect to dashboard
          router.push('/');
          window.location.reload();
        } else {
          console.error('Failed to fetch user details');
        }
      } else {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        setError('contact', {
          type: 'manual',
          message:
            errorData.message || 'Login failed. Please check your credentials.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('contact', {
        type: 'manual',
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  return (
    <Flex h="100vh" position="relative">
      <Flex
        flex="1"
        bg="white"
        alignItems="center"
        justifyContent="center"
        p={6} // Adjusted padding to make the section smaller
      ></Flex>
      <Flex
        flex="3"
        bg="linear-gradient(90deg, rgba(60, 56, 146, 1) 10%, rgba(80, 152, 166, 1) 35%, rgba(144, 200, 209, 1) 100%);"
        alignItems="center"
        justifyContent="center"
        p={6} // Adjusted padding to make the section smaller
        direction="column" // Added to stack the logo and form vertically
      >
      
        <HumacNameLogo/>
        <Box
          w="full"
          maxW="xs" // Adjusted width to make the form smaller
          bg={formBackground}
          p={4} // Adjusted padding to make the form smaller
          borderRadius="lg"
          border="1px" // Added border property
          borderColor="gray.300" // Set border col
          boxShadow="2xl"
          transition="all 0.3s ease"
          _hover={{ transform: 'scale(1.05)' }}
        >
          <Heading
            mb={4} // Adjusted margin to make the heading smaller
            textAlign="center"
            color="linear-gradient(to right, #1e3c72, #2a5298);"
          >
            Log In
          </Heading>
          <FormControl isInvalid={!!errors.contact} mb={3}>
            <FormLabel>Contact Number</FormLabel>
            <Input
              {...register('contact')}
              placeholder="Enter your contact number"
              variant="filled"
              focusBorderColor="gray.300"
              borderColor="gray.300"
              color={useColorModeValue('gray.800', 'white')}
            />
            {errors.contact && (
              <FormErrorMessage>{errors.contact.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.password} mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              {...register('password')}
              placeholder="Enter your password"
              type="password"
              variant="filled"
              focusBorderColor="gray.300"
              borderColor="gray.300"
              color={useColorModeValue('gray.800', 'white')}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          <Button
            // colorScheme="linear-gradient(to right, #1e3c72, #2a5298);"
            bg="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(71,9,121,1) 35%, rgba(0,212,255,1) 100%);"
            color="white"
            mb={6} // Adjusted margin to make the button smaller
            onClick={handleSubmit(onSubmit)}
            width="full"
            size="md" // Adjusted size to make the button smaller
            transition="all 0.3s ease"
            _hover={{
              bg: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(71,9,121,1) 35%, rgba(0,212,255,1) 100%);',
            }}
          >
            Log In
          </Button>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="dark_mode" mb="0">
              Enable Dark Mode?
            </FormLabel>
            <Switch
              id="dark_mode"
              size="md" // Adjusted size to make the switch smaller
              onChange={toggleColorMode}
              sx={{
                '.chakra-switch__track': {
                  bg: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(71,9,121,1) 35%, rgba(0,212,255,1) 100%)',
                },
              }}
            />
          </FormControl>
        </Box>
      </Flex>

      <Box
        position="absolute"
        bg={logoBackground}
        top="50%"
        right="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        p={2} // Added padding to the logo background
        borderRadius="md" // Added border radius to the logo background
      >
        <SignInPageLogo />
      </Box>
    </Flex>
  );
};

export default SignInPage;