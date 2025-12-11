import React from 'react';
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { GrPowerCycle } from 'react-icons/gr';
import { GiDoughRoller } from 'react-icons/gi';
import { RiMotorbikeLine } from 'react-icons/ri';

const suggestedPrompts = [
  {
    title: 'Are there any correlations between cycle times and specific operators or shifts?',
    icon: MdOutlineProductionQuantityLimits,
    color: 'blue.500',
  },
  {
    title: 'What is average cycletime for each machines?',
    icon: GrPowerCycle,
    color: 'pink.500',
  },
  {
    title: 'What should be ideal feedrate for this tool ZOMX160708TR-ME10 MS2050 and also type of mounting?',
    icon: RiMotorbikeLine,
    color: 'orange.500',
  },
  {
    title: 'Top roller is not working?',
    icon: GiDoughRoller,
    color: 'green.500',
  },
];

const SuggestedPrompts = ({ sendMessage }: any) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const cardHoverBgColor = useColorModeValue('gray.50', 'gray.600');
  const cardShadow = useColorModeValue('lg', 'dark-lg');
  const iconBgColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Flex direction="column" gap={4} mb={2}>
      <Text
        fontSize="44px"
        bgGradient="linear(to-r, red.500, yellow.500, green.500, blue.500)"
        bgClip="text"
        py={4}
        mb={4}
      >
        Hello.
      </Text>
      <Text fontSize="44px" mb={4}>
        How can I help you today?
      </Text>
      {/* <Text fontSize="sm" color="gray.500" textAlign="left" mb="20px">
        * Suggested
      </Text> */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
        {suggestedPrompts.map((prompt, index) => (
          <GridItem
            key={index}
            as={Box}
            position="relative"
            p={6}
            borderWidth={1}
            borderRadius="lg"
            cursor="pointer"
            bg={cardBgColor}
            boxShadow={cardShadow}
            _hover={{ bg: cardHoverBgColor, transform: 'translateY(-5px)', boxShadow: 'xl' }}
            transition="background 0.3s, transform 0.3s, box-shadow 0.3s"
            onClick={() => sendMessage(`${prompt.title}`)}
            _active={{ transform: 'scale(0.98)' }}
            height="200px"
          >
            <Text fontSize="sm" fontWeight="bold" mb={4}>
              {prompt.title}
            </Text>
            <Box
              position="absolute"
              bottom={4}
              right={4}
              p={1}
              bg={iconBgColor}
              borderRadius="full"
              boxShadow="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="32px"
              height="32px"
            >
              <Icon
                as={prompt.icon}
                boxSize={4}
                
              />
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Flex>
  );
};

export default SuggestedPrompts;