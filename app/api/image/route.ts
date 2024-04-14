import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';
import { checkSubscription } from '@/lib/subscription';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const openai = new OpenAIApi(configuration);

  const instructionMessage: ChatCompletionRequestMessage = {
    role: 'system',
    content: 'You are the code generator. You must answer only in markdown code snippets. Use code comments for your explanations'
  }

export async function POST(req: Request){
    try {
        const { userId} = auth()
        const body = await req.json()
    

        const {prompt, amount=1, resolution='512x512' } = body

        if(!userId){
            return new NextResponse("Unathorized", { status: 401})
        }
        if(!configuration.apiKey){
            return new NextResponse('Api keys are required', { status: 400})
        }
        if(!prompt){
            return new NextResponse('Prompt is required', { status: 400})
        }
        if(!amount){
            return new NextResponse('Amount is required', { status: 400})
            
        }
        if(!resolution){
            return new NextResponse('Resolution is required', { status: 400})
            
        }
        
        const freeTrial = await checkApiLimit()
        const isPro = await checkSubscription()

        if(!freeTrial && !isPro){

            return new NextResponse('Free trial has expired', { status: 403})

        }

        const response = await openai.createImage({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
          });
          if(!isPro){

            await incrementApiLimit()
        }

          return NextResponse.json(response.data.data);

    }catch(error){

        console.log('[IMAGE_ERROR', error)

        return new NextResponse('Internal error', {})

    }
}