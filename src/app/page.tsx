"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import gsap from "gsap"
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [message, setMessage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);


  const speak = (text: string) => {
    if (window.speechSynthesis && typeof SpeechSynthesisUtterance !== undefined) {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const femaleVoices = voices.filter((voice) => voice.name === " Googleहिन्दी");
      let voiceToUse = femaleVoices.length > 0 ? femaleVoices[0] : voices[0]; 
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.voice = voiceToUse;
      synth.speak(utterThis);
    }
  };
  
  
  
  

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const getData = async (prompt: string) => {
    setMessage((prevMessage) => [...prevMessage, prompt]);
    setPrompt("");
    setLoading(true);
    try {
      const res = await axios.post<{ message: string }>("/api/generateAnswer", { prompt });
      const data = res.data;
      setMessage((prevMessage) => [...prevMessage, data.message]);
      setLoading(false);
      if (isSpeaking) {
        speak(data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useGSAP(()=>{
    gsap.from("#heading",{
      y:100,
      opacity:0,
      duration:1,
      ease:"power2.inOut"
    })


  },[])

  useEffect(()=>{
    if(message.length > 0){
      gsap.from('#loader',{
        delay:0.3,
        opacity:1,
        duration:0.2,
        ease:"power2.inOut"
      })

      const isOdd = message.length %2  !== 0;
      const xValue = isOdd? 50: -50;
      const messageSelector = `#message:nth-child(${message.length})`;
      gsap.from(messageSelector,{

        x:xValue,
        y:50,
        opacity:0,
        duration:0.3,
        ease:"power2.out"

      })
    }
  },[message])

  return (
    <div className="flex flex-col justify-evenly items-center h-screen ">
      <h1 className="text-3xl font-bold -mt-16 bg-gradient-to-r from-purple-500 to-purple-300 text-transparent bg-clip-text" id="heading">
        AI Chat Assistant
      </h1>
      <div className="w-[90vw] relative sm:w-[60vw] h-[63vh]  -mt-20 text-center text-white font-bold rounded-lg flex flex-col gap-2 justify-start py-5 items-center bg-gradient-to-b from-gray-900 to-transparent px-3 overflow-y-scroll overflow-x-hidden scroll-hide">
        {message.length === 0 ? (
          <span className="text-3xl text-center mx-auto my-auto">
            No Messages To Show
          </span>
        ) : (
          message.map((msg, id) => (
            <p
              key={id}
              id="message"
              className={`px-2 py-1 font-semibold ${
                id % 2 === 0 ? "ml-auto bg-purple-500 text-white" : "mr-auto bg-white text-black"
              }`}
            >
              {msg}
            </p>
          ))
        )}
        {loading && (
          <BeatLoader color="black" className="px-2 py-1 mr-auto bg-white text-xs" id="loader"/>
        )}
        <span className="text-white absolute left-2 top-2 text-2xl font-bold cursor-pointer">
          {!isSpeaking ? (
            <HiOutlineSpeakerXMark onClick={() => { setIsSpeaking(true); stopSpeaking(); }} />
          ) : (
            <HiOutlineSpeakerWave onClick={() => setIsSpeaking(false)} />
          )}
        </span>
      </div>
      <div className="w-[80vw] sm:w-[60vw] fixed bottom-16 left-0 right-0 flex justify-between items-center mx-auto bg-gray-900 rounded-lg">
        <input
          type="text"
          placeholder="Enter your message here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="px-5 py-3 w-full rounded-lg outline-none text-purple-300 bg-gray-900"
        />
        <button
          className="absolute right-0 px-5 py-3 bg-purple-500 text-white rounded-lg"
          onClick={() => getData(prompt)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;
