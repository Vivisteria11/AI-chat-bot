/*import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import { GoogleGenerativeAI } from "@google/generative-ai"// Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt ='hi ,you are an AI bot for rakshita '

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'gpt-4o', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}*/

import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are the Headstarter Company Chatbot, a helpful and informative representative of Headstarter. Your goal is to provide accurate, engaging, and helpful responses to users visiting our website.You have deep knowledge of Headstarter's services, expertise, team, and case studies. Respond authoritatively while remaining approachable and enthusiastic.Assist users by answering their questions comprehensively, directing them to relevant resources, and helping them connect with the right departments.Provide responses in plain text without any special formatting (like asterisks for bolding). Maintain a professional and helpful tone.Please provide responses in plain text without any bolding or other formatting using symbols like asterisks.",
        persona: "Headstarter Company Chatbot",
        
    })

    async function startChat(history) {
        return model.startChat({
            history: history,
            generationConfig: { 
                maxOutputTokens: 8000,
            },
        })
    }

    export async function POST(req) {
        const history = await req.json()
        const userMsg = history[history.length - 1]
    
        // history.forEach(element => {
        //     // console.log(element["role"])
        //     // console.log(element["content"])
        //     console.log(element)
        // });
    
        // console.log(userMsg.parts[0].text)
        // console.log(typeof(userMsg.parts[0].text))
        try {
            //const userMsg = await req.json()
            const chat = await startChat(history)
            const result = await chat.sendMessage(userMsg.parts[0].text)
            const response = await result.response
            const output = response.text()


        // Remove asterisks for bolding
        const outputWithoutAsterisks = output.replace(/\*/g, ''); 

        return NextResponse.json(outputWithoutAsterisks); 
        } catch (e) {
            console.error(e)
            return NextResponse.json({text: "error, check console"})
        }
        
        //const result = await chat.sendMessageStream(userMsg); // stream allows returning before entire result is written for faster interaction
    
        // let text = '';
        // for await (const chunk of result.stream) {
        //     const chunkText = chunk.text();
        //     //console.log(chunkText);
        //     text += chunkText;
        // }
        
    
    }


