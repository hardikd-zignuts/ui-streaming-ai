"use client";
import { imageData } from "@/utils/image";
import { Template } from "@/utils/template";
import axios from "axios";
import React, { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", inputValue);
    axios
      .post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: 'Youre a frontend web developer that specializes in tailwindcss. Given a description or an image, generate HTML with tailwindcss. You should support both dark and light mode. It should render nicely on desktop, tablet, and mobile. Keep your responses concise and just return HTML that would appear in the <body> no need for <head> or <body>. Use placehold.co for placeholder images. If the user asks for interactivity, use modern ES6 javascript and native browser apis to handle events. Do not generate SVGs, instead use an image tag with an alt attribute of the same descriptive name, i.e.: <img aria-hidden="true" alt="check" src="/icons/check.svg" />',
                },
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: imageData,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
          },
        }
      )
      .then((response) => {
        console.log(
          JSON.parse(response.data.candidates[0].content.parts[0].text)
        );
        setGeneratedText(
          JSON.parse(response.data.candidates[0].content.parts[0].text).html
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-200 h-min-500px flex justify-center items-center">
        <h1 className="text-3xl font-bold">AI UI Streaming</h1>
      </div>
      <div className="min-h-[700px] bg-slate-100/50 border border-black my-5 mx-5">
        <iframe
          className="w-full h-full"
          srcDoc={`
          ${Template(generatedText)}
          `}
        ></iframe>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
        <div className="flex flex-col justify-center items-center gap-5">
          <input
            required
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700 border-2"
            placeholder="Enter your text"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
