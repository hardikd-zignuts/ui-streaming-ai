import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  String(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
);

export default genAI;
