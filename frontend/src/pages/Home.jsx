import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeftIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import io from "socket.io-client";

const App = () => {
  const messagesEndRef = useRef(null);

  const [socket, setsocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const socketinstance = io("http://localhost:3000");
    setsocket(socketinstance);

    socketinstance.on("ai-message-response", (data) => {
      let messageText = "An error occurred.";
      if (data && typeof data.res === "string") {
        messageText = data.res;
      } else if (data && typeof data === "string") {
        messageText = data;
      } else if (data && typeof data.text === "string") {
        messageText = data.text;
      }
      if (data && typeof data.response === "string") {
        messageText = data.response;
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: messageText,
          sender: "bot",
        },
      ]);
      setIsLoading(false);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {}, [messages]);

  const handleSend = () => {
    if (input.trim()) {
    
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setIsLoading(true);

     
      socket.emit("ai-message", { prompt: input });
      setTimeout(scrollToBottom, 0);
      setInput("");
    }
  };


  const ChatBubble = ({ message }) => {
    const isUser = message.sender === "user";
    const isBot = message.sender === "bot";

  
    const userClasses = "bg-blue-600 text-white self-end rounded-bl-xl";
    const botClasses = "bg-gray-200 text-gray-800 self-start rounded-br-xl";

    return (
      <div
        className={`p-3 max-w-[80%] my-1 mx-2 rounded-2xl shadow-sm ${
          isUser ? userClasses : botClasses
        }`}
      >
        <p className="text-sm">
          {typeof message.text === "string"
            ? message.text
            : "Invalid message format."}
        </p>
      </div>
    );
  };


  const ChatHeader = () => {
    return (
      <div className="flex items-center p-4 bg-white/50 backdrop-blur-md rounded-t-3xl border-b border-gray-200">
        <ArrowLeftIcon className="h-6 w-6 text-indigo-800 cursor-pointer" />
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Hello, I'm Noaii
          </h2>
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
      
          <span role="img" aria-label="robot">
            🤖
          </span>
        </div>
      </div>
    );
  };


  const ChatInput = () => {
    return (
      <div className="p-4 bg-white/50 backdrop-blur-md rounded-b-3xl">
        <div className="flex items-center space-x-2 p-2 rounded-full bg-gray-100/70 shadow-inner">
          <XMarkIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-800"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <div className="flex space-x-1">
            <button
              onClick={handleSend}
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition duration-300"
            >
              <PaperAirplaneIcon className="h-5 w-5 text-white transform rotate-90" />
            </button>
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300">
              <MicrophoneIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="relative w-full max-w-sm h-[80vh] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
        <div className=" w-full absolute top-0 left-1/2 -translate-x-1/2  p-2 rounded-5xl bg-gray-200 rounded-b-3xl z-20 flex items-center justify-center">
          <h1 className="text-blue-700 font-bold text-3xl">
            <i class="ri-chat-3-line"></i>ChatBot
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto pt-18 pb-20 p-2 scroll  space-y-4">
          <div className="flex flex-col space-y-2">
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}

            {isLoading && (
              <div className="flex justify-start my-1 mx-2">
                <div className="p-3 bg-gray-200 rounded-2xl rounded-br-xl shadow-sm animate-pulse">
                  <div className="h-3 w-16 bg-gray-400 rounded"></div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-100 rounded-b-3xl flex flex-col">
          <div className="flex justify-between items-center bg-gray-200 rounded-full px-4 py-2 mt-4">
            <XMarkIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 mx-2 bg-transparent focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-full bg-indigo-600 text-white"
            >
              <PaperAirplaneIcon className="h-6 w-6 transform -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
