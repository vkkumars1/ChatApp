// // // const express = require('express');
// // // const app = express();
// // // // to enable WebSocket connection we have to use http because Socket.io connections handles with http
// // // // http->by default nodejs server-routing middleware etc but complex then we use expresss()
// // // const http = require('http');
// // // // to enable request coming from frontend
// // // const cors = require('cors');
// // // // Server class in Socket.io package
// // // const {Server} =  require('socket.io');
// // // // http ke sath sath express server ki bhi functionality aajaye

// // // //middleware
// // // // allow any request coming from outside
// // // app.use(cors())
// // // //nodejs server
// // // const server = http.createServer(app);
// // // // basically Socket.io ko server se attach/connect krdiya aur cors pass krdiya

// // // // Socket.io server to establish connection with nodejs server
// // // const io = new Server(server,{
// // //    cors: {
// // //     origin: 'http://localhost:5173/',
// // //     methods: ['GET', 'POST']
// // //    }
// // // })
// // // //client side io ka connection ho toh frontend se socket milega and log hoga
// // // io.on('connection',(socket)=>{
// // //     console.log(`user connected with id ${socket.id}`);
    
// // //     socket.on('disconnect', () => {
// // //         console.log('user disconnected');
// // //     });

// // //     // socket.on('chat message',(msg) => {
// // //     //     console.log('message: ', msg);
// // //     //     io.emit('chat message', msg);
// // //     // });
// // // })

// // // server.listen(3000,()=>{
// // //     console.log('Server is running on port 3000');  // server start ho gaya hai 3000 port se
// // // })
// // const express = require('express');
// // const app = express();
// // const http = require('http');
// // const cors = require('cors');
// // const { Server } = require('socket.io');

// // app.use(cors());

// // const server = http.createServer(app);

// // const io = new Server(server, {
// //     cors: {
// //         origin: 'http://localhost:5173', // Ensure this matches your frontend URL exactly
// //         methods: ['GET', 'POST']
// //     }
// // });

// // io.on('connection', (socket) => {
// //     console.log(`User connected with id ${socket.id}`);
    
// //     socket.on('send-message',(messageData)=>{
// //         console.log(messageData);
// //     })

// //     io.emit('receive-message',messageData);
// //     socket.on('disconnect', () => {
// //         console.log('User disconnected');
// //     });

// //     // Uncomment this to listen for a 'chat message' event
// //     // socket.on('chat message', (msg) => {
// //     //     console.log('Message: ', msg);
// //     //     io.emit('chat message', msg);
// //     // });
// // });

// // server.listen(3000, () => {
// //     console.log('Server is running on port 3000');
// // });
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import 'animate.css';

// const socket = io('http://localhost:3000'); // Ensure this URL matches your backend

// const App = () => {
//   const [chat, setChat] = useState(false);
//   const [user, setUser] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     socket.on('receive-message', (messageData) => {
//       setMessages(prevMessages => [...prevMessages, messageData]);
//     });

//     return () => {
//       socket.off('receive-message');
//     };
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const messageData = {
//       message: newMessage,
//       user: user,
//       time: new Date(Date.now()).toLocaleTimeString(),
//     };
//     socket.emit('send-message', messageData);
//     setNewMessage("");
//   };

//   return (
//     <div className='h-screen w-screen bg-custom-gradient'>
//       {chat ? (
//         <div className='w-screen h-screen flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-600'>
//           <form className='flex items-center space-y-4 p-6 rounded-lg shadow-lg gap-2 md:gap-4' onSubmit={handleSubmit}>
//             <input 
//               type="text" 
//               value={newMessage}
//               placeholder='Type Your Message' 
//               onChange={(e) => setNewMessage(e.target.value)}
//               className='w-full rounded-md outline-none px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-center' 
//             />
//             <button 
//               type='submit'
//               className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105'
//             >
//               Send
//             </button>
//           </form>
//           <div className='w-full p-4'>
//             {messages.map((msg, index) => (
//               <div key={index} className='bg-white p-2 my-2 rounded-md shadow-md'>
//                 <strong>{msg.user}</strong>: {msg.message} <span className='text-xs text-gray-500'>{msg.time}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className='w-screen h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600'>
//           <form className='flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg gap-3'>
//             <input 
//               type="text" 
//               value={user}
//               placeholder='Your Name' 
//               onChange={(e) => setUser(e.target.value)}
//               className='w-full rounded-md outline-none px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out text-center' 
//             />
//             <button 
//               type='submit'
//               onClick={(e) => {
//                 e.preventDefault();
//                 if (user.trim() !== "") {
//                   setChat(true);
//                 }
//               }}
//               className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105 hover:animate__bounce'
//             >
//               Start Chat
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Ensure this matches your frontend URL exactly
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected with id ${socket.id}`);
    
    socket.on('send-message', (messageData) => {
        // console.log(messageData);
        io.emit('receive-message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
const PORT =  process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server is running on port 3000');
});
