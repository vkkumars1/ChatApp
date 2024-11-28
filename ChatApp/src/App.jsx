import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './index.css';

const socket = io('https://chatapp-gkqq.onrender.com');

const App = () => {
  const [chat, setChat] = useState(false);
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on('receive-message', (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      toast.warn('Enter Message', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    const messageData = {
      message: newMessage,
      user: user,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('send-message', messageData);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="w-full max-w-4xl">
        {chat ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate__animated animate__fadeIn">
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">Chat Room</h2>
              <div className="h-64 sm:h-80 md:h-96 overflow-y-auto custom-scrollbar bg-gray-50 rounded-xl p-3 sm:p-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`p-2 sm:p-3 my-2 rounded-xl shadow-md max-w-xs sm:max-w-sm break-words ${user === msg.user ? 'ml-auto bg-blue-100 text-blue-800' : 'mr-auto bg-gray-200 text-gray-800'}`}>
                    <strong className="capitalize">{msg.user}</strong>
                    <p className="mt-1">{msg.message}</p>
                    <span className="block text-xs text-gray-500 text-right mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>
              <form className="flex flex-col sm:flex-row gap-2 sm:gap-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={newMessage}
                  placeholder="Type Your Message"
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out"
                  data-tooltip-id="message-input-tooltip"
                  data-tooltip-content="Type your message here"
                />
                <Tooltip id="message-input-tooltip" />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  data-tooltip-id="send-button-tooltip"
                  data-tooltip-content="Send your message"
                >
                  Send
                </button>
                <Tooltip id="send-button-tooltip" />
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate__animated animate__zoomIn">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">Welcome to the Chat</h2>
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => { e.preventDefault(); setChat(user.trim() !== ""); }}>
              <input
                type="text"
                placeholder="Your Name"
                onChange={(e) => setUser(e.target.value)}
                className="w-full rounded-lg px-4 py-2 bg-gray-100 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-center"
                data-tooltip-id="name-input-tooltip"
                data-tooltip-content="Enter your name"
              />
              <Tooltip id="name-input-tooltip" />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                data-tooltip-id="start-chat-button-tooltip"
                data-tooltip-content="Start chat"
              >
                Start Chat
              </button>
              <Tooltip id="start-chat-button-tooltip" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

