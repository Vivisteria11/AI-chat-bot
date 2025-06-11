/*'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')  // Clear the input field
  setMessages((messages) => [
    ...messages,
    { role: 'user', content: message },  // Add the user's message to the chat
    { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
  ])

  // Send the message to the server
  const response = fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([...messages, { role: 'user', content: message }]),
  }).then(async (res) => {
    const reader = res.body.getReader()  // Get a reader to read the response body
    const decoder = new TextDecoder()  // Create a decoder to decode the response text

    let result = ''
    // Function to process the text from the response
    return reader.read().then(function processText({ done, value }) {
      if (done) {
        return result
      }
      const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
        let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
        ]
      })
      return reader.read().then(processText)  // Continue reading the next chunk of the response
    })
  })
}
    // We'll implement this function in the next section
  

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}*/
"use client"

import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { Send } from "lucide-react";

export default function Home() {
  const [history, setHistory] = useState([]);
  const firstMessage = "Hi there! I'm the Headstarter virtual assistant. How can I help you today?";
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    // Append user's message to history
    const newHistory = [...history, { role: "user", parts: [{ text: message }] }];
    setHistory(newHistory);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHistory)
      });

      const data = await response.json();

      setHistory((history) => [
        ...history,
        { role: "model", parts: [{ text: data.text }] }
      ]);
    } catch (err) {
      console.error("Failed to fetch response:", err);
    }
  };

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      flexDirection="column"
      alignItems={'center'}
      justifyContent={'center'}
      bgcolor={'whitesmoke'}
    >
      <Stack 
        direction={'column'} 
        justifyContent={'flex-end'}
        width={'70%'}
        height={'100%'} 
        border={'2px solid black'} 
        borderRadius={5}
        p={2}
        spacing={3}
        bgcolor="white"
      >
        {/* Message display area */}
        <Stack 
          direction={'column'} 
          width="100%" 
          height="100%" 
          overflow={'auto'} 
          spacing={2}
          padding={1}
        >
          {/* Initial Assistant Message */}
          <Box display="flex" justifyContent={'flex-start'}>
            <Box 
              bgcolor={'secondary.light'}
              borderRadius={10}
              p={2}
              maxWidth="70%"
            >
              <Typography color={'white'}>
                {firstMessage}
              </Typography>
            </Box>
          </Box>
          
          {/* User and Assistant Messages */}
          {history.map((textObject, index) => (
            <Box
              key={index}
              display={'flex'}
              justifyContent={textObject.role === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Box
                bgcolor={textObject.role === 'user' ? 'primary.main' : 'secondary.light'}
                borderRadius={16}
                p={2}
                maxWidth="70%"
                color="white"
              >
                {textObject.parts[0]?.text}
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Message input and send button */}
        <Stack direction={'row'} spacing={2}>
          <TextField 
            label='Message' 
            fullWidth 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
          />
          <Button variant='contained' onClick={sendMessage}>
            <Send />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
