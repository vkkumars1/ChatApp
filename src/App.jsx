import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');

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
    <div className='h-screen w-screen bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center'>
      <ToastContainer />
      {chat ? (
        <div className='flex flex-col items-center w-full max-w-2xl p-4'>
          <div className='overflow-y-auto flex-1 w-full p-4 bg-white rounded-md shadow-lg mb-4 animate__animated animate__fadeIn custom-scrollbar'>
            {messages.map((msg, index) => (
              <div key={index} className={`bg-gray-100 p-2 my-2 rounded-md shadow-md max-w-xs break-words ${user === msg.user ? 'ml-auto bg-green-100' : 'mr-auto bg-blue-100'}`}>
                <strong>{msg.user.charAt(0).toUpperCase() + msg.user.slice(1)}</strong>: {msg.message}
                <span className='block text-xs text-gray-500 text-right'>{msg.time}</span>
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
              className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105'
              data-tooltip-id="send-button-tooltip"
              data-tooltip-content="Send your message"
            >
              Send
            </button>
            <Tooltip id="send-button-tooltip" />
          </form>
        </div>
      ) : (
        <div className='flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg gap-3 animate__animated animate__zoomIn'>
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
              className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105'
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
