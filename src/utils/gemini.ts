import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  String(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
);

const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export { geminiFlash };
export default genAI;
