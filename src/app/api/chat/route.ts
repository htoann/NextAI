import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const result = await model.generateContentStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = await chunk.text(); // Extract the text from each chunk
            controller.enqueue(new TextEncoder().encode(chunkText)); // Send the chunk to the client
          }
          controller.close();
        } catch (error) {
          console.error("Error while streaming:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain", // The response will be text-based
        "Transfer-Encoding": "chunked", // Indicate that this is a streamed response
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500 }
    );
  }
}
