import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Box,
  Image,
  Text,
  Stack,
  Badge,
  Flex,
  useColorModeValue,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  ScaleFade
} from '@chakra-ui/react';

const UserProfile = ({ username, profileData }) => {
  
  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Box p={5} shadow="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" >
        <Heading as="h1" size="4xl" mt="20" mb="20" textAlign="center" mb="10">
          {username}'s git_together profile
        </Heading>
        <Flex mt={30} align="center" justify="center" mb={5} direction="column">
          <Flex direction="column" align="center" justify="center" p={5} w="100%">
            <Flex width="420px" height="200px" mb={4}>
              <Image mr={20} borderRadius="20" boxSize="200px" src={profileData.imageUrl} alt={profileData.actualTechBroName} mr={5} />
              <CircularProgressbar
                value={profileData.score}
                text={`${profileData.score}%`}
                strokeWidth={10}
                styles={buildStyles({
                  strokeLinecap: 'butt', // Flat edge makes the progress bar look like a bar instead of a donut
                  textSize: '16px',
                  pathTransitionDuration: 0.5,
                  pathColor: `rgba(62, 152, 199, ${profileData.score / 100})`,
                  textColor: '#3e98c7',
                  trailColor: '#d6d6d6',
                  backgroundColor: '#3e98c7',
                })}
              />

            </Flex>

            <Text fontSize="xl">*Overall Dateability Score*</Text>
          </Flex>
          <Box flex="1" w="500px">
            <Text fontWeight="bold" fontSize="2xl" color={useColorModeValue('gray.700', 'white')}>{profileData.actualTechBroName}</Text>
            <Text mt={1} fontSize="md" color={useColorModeValue('gray.600', 'gray.200')}>{profileData.datingBio}</Text>
          </Box>
          <StatGroup>
            <Stat mr="50">
              <StatLabel><b>Followers</b></StatLabel>
              <StatNumber>{profileData.followers}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel><b>Following</b></StatLabel>
              <StatNumber>{profileData.followings}</StatNumber>
            </Stat>
        </StatGroup>
        </Flex>

      <Flex direction="column" align="center" justify="center"> 
      {profileData.hasContribImage && <>
        <Heading as="h2" size="lg" mt="20" mb="5" textAlign="center" mb="10">
         Will they be committed?
        </Heading>
        <img src={`http://localhost:3000/screenshots/${username.trim().toLowerCase()}.png`} />
        </>}
       <Heading as="h2" size="lg" mt="20" mb="5" textAlign="center" mb="10">
        {username}'s Date-ysis
        </Heading>
        <Flex w="500px" mt="4" align="center" justify="center" flexWrap="wrap">
         
          {profileData.badges.map((badge, index) => {
            // Generate a random saturated color
            {/*const randomHue = Math.floor(Math.random() * 360);*/}
            const backgroundColor = `rgb(100,100,100)`;

            return (
              <Box
                key={index}
                mr="2"
                mb="2"
                maxWidth="150px"
                px="5" 
                py="5"
                mb="10"
                mr="10"
                style={{
                  backgroundColor,
                  color: 'white',
                  fontSize: "16px",
                  textAlign: "center",
                  borderRadius: '10px', // equivalent to 6px
                  fontWeight: 'bold',
                }}
              >
                {badge}
              </Box>
            );
          })}
        </Flex>
      </Flex>
      </Box>
    </ScaleFade>
  );
};

export default UserProfile;
