import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './index.css'; // Import the CSS file here

const socket = io('http://localhost:3000'); // Ensure this URL matches your backend

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
    <div className='overflow-y-scroll h-screen w-screen bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center p-4'>
      <ToastContainer />
      {chat ? (
        <div className='flex flex-col items-center w-full max-w-2xl p-4 bg-white/30 rounded-lg shadow-2xl animate__animated animate__fadeIn custom-scrollbar'>
          <div className='flex-1 w-full p-4 rounded-md shadow-lg mb-4 overflow-y-auto custom-scrollbar h-96'>
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 my-2 rounded-md shadow-md max-w-xs break-words ${user === msg.user ? 'ml-auto bg-gradient-to-r from-green-400 to-green-500 text-white' : 'mr-auto bg-gradient-to-r from-blue-400 to-blue-500 text-white'}`}>
                <strong className='capitalize'>{msg.user}</strong>: {msg.message}
                <span className='block text-xs text-gray-200 text-right'>{msg.time}</span>
              </div>
            ))}
          </div>
          <form className='flex w-full gap-2' onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              placeholder='Type Your Message'
              onChange={(e) => setNewMessage(e.target.value)}
              className='flex-1 rounded-md px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out'
              data-tooltip-id="message-input-tooltip"
              data-tooltip-content="Type your message here"
            />
            <Tooltip id="message-input-tooltip" />
            <button
              type='submit'
              className='bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105'
              data-tooltip-id="send-button-tooltip"
              data-tooltip-content="Send your message"
            >
              Send
            </button>
            <Tooltip id="send-button-tooltip" />
          </form>
        </div>
      ) : (
        <div className='flex flex-col items-center space-y-4 p-6 bg-white/30 rounded-lg shadow-2xl animate__animated animate__zoomIn'>
          <form className='flex flex-col w-full items-center gap-4' onSubmit={(e) => { e.preventDefault(); setChat(user.trim() !== ""); }}>
            <input
              type="text"
              placeholder='Your Name'
              onChange={(e) => setUser(e.target.value)}
              className='w-full rounded-md px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-center'
              data-tooltip-id="name-input-tooltip"
              data-tooltip-content="Enter your name"
            />
            <Tooltip id="name-input-tooltip" />
            <button
              type='submit'
              className='bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105'
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
  );
};

export default App;
