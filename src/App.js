import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import { ChatMessage } from './protos/chat_pb';

const socket = io('http://localhost:3000'); // Adjust the URL if your microservice is running on a different host/port

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('butterfly-chat', (msg) => {
      const message = ChatMessage.deserializeBinary(new Uint8Array(msg));
      const messageObj = {
        message: message.getMessage(),
        fromUserId: message.getFromUserId(),
        toUserId: message.getToUserId()
      };
      setMessages((prevMessages) => [...prevMessages, messageObj]);
    });

    return () => {
      socket.off('butterfly-chat');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = new ChatMessage();
      chatMessage.setMessage(message);
      chatMessage.setFromUserId(1);
      chatMessage.setToUserId(2);
      // Serialize the message
      const data = chatMessage.serializeBinary();
      socket.emit('butterfly-chat', data);
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1>Chat</h1>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>User {msg.user_id}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;