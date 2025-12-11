'use client';
import React from 'react';
import dayjs from 'dayjs';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

interface Membership {
  firstName: string;
  lastName: string;
  createdAt: string; // Assuming the createdAt is returned as a string
}

const Greeting = ({
  oldestMemberName,
}: {
  oldestMemberName: string | null;
}) => {
  // Function to get the current greeting based on the time of day
  const getCurrentGreeting = () => {
    const currentHour = dayjs().hour();
    if (currentHour < 12) {
      return `Good Morning, ${oldestMemberName}`;
    } else if (currentHour < 18) {
      return `Good Afternoon, ${oldestMemberName}`;
    } else {
      return `Good Evening, ${oldestMemberName}`;
    }
  };

  const getCurrentIcon = () => {
    const currentHour = dayjs().hour();
    if (currentHour < 12) {
      return '⛅';
    } else if (currentHour < 18) {
      return '☀️';
    } else {
      return '🌙';
    }
  };

  const formatDate = () => {
    return dayjs().format('dddd, MMM D, h:mm A');
  };

  const greetingMessage = oldestMemberName
    ? `${getCurrentGreeting()}!`
    : getCurrentGreeting();

  const textColor = useColorModeValue('gray.800', 'white');
  const textColorForDate = useColorModeValue('gray.800', 'gray.400');

  return (
    <Box>
      <Text color={textColor} fontSize="2xl" fontWeight="bold">
        {greetingMessage}
      </Text>
      <Text color={textColorForDate} fontSize="sm">
        {formatDate()} {getCurrentIcon()}
      </Text>
    </Box>
  );
};

export default Greeting;
