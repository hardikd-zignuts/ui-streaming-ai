"use client";
import { generateUI } from "@/actions";
import { geminiFlash } from "@/utils/gemini";
import { Template } from "@/utils/template";
import React, { useMemo, useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  function extractText(str: string) {
    return str?.trim()?.slice(9, str?.trim()?.length - 1);
  }
  function extractCode(str: string) {
    if (str.includes("```html")) {
      return str?.trim()?.slice(7);
    } else if (str.includes("```")) {
      return str?.trim()?.slice(-3);
    }
    return str;
  }
  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  function decodeUnicodeString(input: any) {
    // Use a regular expression to find all the Unicode escape sequences in the input string
    let decodedString = input.replace(/\\u[\dA-F]{4}/gi, function (match: any) {
      // Convert each escape sequence to the corresponding character
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });

    // Additional step to replace escaped quotes and other characters
    decodedString = decodedString.replace(/\\"/g, '"').replace(/\\n/g, "\n");

    return decodedString;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    // Convert image to Base64
    const imageData = (await toBase64(image)) as string;

    const prompt = `Youre a frontend web developer that specializes in tailwindcss. Given a description or an image, generate HTML with tailwindcss. You should support both dark and light mode. It should render nicely on desktop, tablet, and mobile. Keep your responses concise and just return HTML that would appear in the <body> no need for <head> or <body>. Use placehold.co for placeholder images. If the user asks for interactivity, use modern ES6 javascript and native browser apis to handle events. Do not generate SVGs, instead use an image tag with an alt attribute of the same descriptive name, i.e.: <img aria-hidden="true" alt="check" src="/icons/check.svg" />`;

    const imageParts: any = [(imageData as any).slice(22)];

    // const result = await geminiFlash.generateContentStream([
    //   prompt,
    //   ...imageParts,
    // ]);

    // for await (const chunk of result.stream) {
    //   const chunkText = chunk.text();
    //   console.log(chunkText);
    //   setGeneratedText(
    //     (prev) => prev + extractCode(decodeUnicodeString(chunkText))
    //   );
    // }
    const data = await generateUI(prompt, imageParts);
    console.log({ data });
    // const aiResponse = await fetch(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       contents: [
    //         {
    //           parts: [
    //             {
    //               text: prompt + inputValue,
    //             },
    //             {
    //               inlineData: {
    //                 mimeType: "image/png",
    //                 data: imageParts[0],
    //               },
    //             },
    //           ],
    //         },
    //       ],
    //       // generationConfig: {
    //       //   response_mime_type: "application/json",
    //       // },
    //     }),
    //   }
    // );

    // const reader = aiResponse.body?.getReader();
    // const decoder = new TextDecoder("utf-8");
    // if (!reader) return;
    // while (true) {
    //   const { value, done } = await reader.read();
    //   if (done) break;

    //   const chunk = decoder.decode(value, { stream: true });
    //   const dataString = chunk.trim().split("\n");
    //   dataString.forEach((data) => {
    //     if (data?.includes(`"text":`)) {
    //       const html = extractText(data);
    //       setGeneratedText((prev) => prev + decodeUnicodeString(html));
    //     }
    //   });
    // }
  };

  const iframeSrc = useMemo(() => {
    return `${Template(generatedText)}`;
  }, [generatedText]);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-200 h-min-500px flex justify-center items-center">
        <h1 className="text-3xl font-bold">AI UI Streaming</h1>
      </div>
      <div className="min-h-[700px] bg-slate-100/50 border border-black my-5 mx-5">
        <iframe className="w-full h-full" srcDoc={iframeSrc}></iframe>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
        <div className="flex flex-col justify-center items-center gap-5">
          <input
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
