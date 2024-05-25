import {NextResponse} from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = process.env.GEMINI_API_KEY as string;
const modelKey = process.env.GEMINI_MODEL as string;

if (!apiKey || !modelKey) {
    throw new Error("GEMINI_API_KEY or GEMINI_MODEL is not defined");
  }

const genAI = new GoogleGenerativeAI(apiKey);

export const POST = async (request: Request) => {
    const model = genAI.getGenerativeModel({ model: modelKey});
   try {
    const { prompt } = await request.json();
    
      const chat = model.startChat({
        history:[
          {
            role:"user",
            parts:[
              {text:'hello i want to chat with my personal AI assistant'}
            ],
          },
          {
            role:"model",
            parts:[
              {
                text:"You are a beautiful AI female assistant of the  user"
              },
            ],
          }
        ],
        generationConfig:{
          maxOutputTokens:100,
        }
      })
       const result = await chat.sendMessage(prompt)
       const response = await result.response
       const text = response.text();
       return NextResponse.json({success:true,message:text})
   } catch (error:any) {
   
      return NextResponse.json({ success: false, message: error.message });
    }
    
   

   
  // Add your handling logic here if needed
};
