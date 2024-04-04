import { useState } from 'react'

import { Flex, Heading } from '@chakra-ui/react';

import SearchGithubProfile from "./SearchGithubProfile"

function App() {

  return (
    <Flex w="100vw" align="center" justify="center" direction="column">
      <Heading as="h1" size="4xl" mt="5" mb="5" textAlign="center" mb="30">
       ❤️ git_together 🥰
      </Heading>
      <SearchGithubProfile />
    </Flex>
  )
}

export default App
