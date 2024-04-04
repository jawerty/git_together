import React, { useState } from 'react';
import {
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useColorMode,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

import UserProfile from "./UserProfile";

const SearchGithubProfile = () => {
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState()
  const [username, setUsername] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.200', 'gray.700');
  const color = useColorModeValue('gray.800', 'white');

  const fetchGithubProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/matchmaker?github=${username}`);


      const result = await response.json()

      setProfileData(result.data)
    } catch(e) {
      console.log(e)
    }

    setLoading(false)
  
  };

  return (
    <VStack spacing={4} p={4} bg={bg} borderRadius="md">
      <FormControl id="github-username">
        <FormLabel fontWeight="bold" color={color}>Enter the GitHub Username of Your Crush</FormLabel>
        <InputGroup style={{
          display: "flex",
          alignItems: "center",
          justifyContent: 'center'
        }}>
          <Input
            variant="filled"
            placeholder="e.g., octocat"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            color={color}
            style={{
              padding: "10px 20px",
              fontSize: "20px",
              outline: "none",
            }}
            mt="10"
            _placeholder={{ opacity: 0.8, color: color }}
          />
        </InputGroup>
      </FormControl>
      <Button 
        leftIcon={<SearchIcon />} 
        colorScheme="purple" 
        onClick={fetchGithubProfile}
        size="lg"
        fontSize="md"
        mt="10"
      >
        Search
      </Button>
      {loading && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200" style={{shapeRendering: "auto", display: "block", background: "transparent"}} xmlnsXlink="http://www.w3.org/1999/xlink"><g><rect x="19" y="19" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0s" calcMode="discrete"></animate>
        </rect><rect x="40" y="19" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.125s" calcMode="discrete"></animate>
        </rect><rect x="61" y="19" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.25s" calcMode="discrete"></animate>
        </rect><rect x="19" y="40" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.875s" calcMode="discrete"></animate>
        </rect><rect x="61" y="40" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.375s" calcMode="discrete"></animate>
        </rect><rect x="19" y="61" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.75s" calcMode="discrete"></animate>
        </rect><rect x="40" y="61" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.625s" calcMode="discrete"></animate>
        </rect><rect x="61" y="61" width="20" height="20" fill="#008374">
          <animate attributeName="fill" values="#89ba16;#008374;#008374" keyTimes="0;0.125;1" dur="1s" repeatCount="indefinite" begin="0.5s" calcMode="discrete"></animate>
        </rect><g></g></g></svg>}
      {profileData && <UserProfile username={username} profileData={profileData} />}
    </VStack>
  );
};

export default SearchGithubProfile;
