

import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are a friendly and insightful Chatbot. Your goal is to provide accurate, engaging, and helpful responses to users visiting our website.You have deep knowledge of Headstarter's services, expertise, team, and case studies. Respond authoritatively while remaining approachable and enthusiastic.Assist users by answering their questions comprehensively, directing them to relevant resources, and helping them connect with the right departments.Provide responses in plain text without any special formatting (like asterisks for bolding). Maintain a professional and helpful tone.Please provide responses in plain text without any bolding or other formatting using symbols like asterisks.",
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

         return NextResponse.json({ text: outputWithoutAsterisks });        
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


