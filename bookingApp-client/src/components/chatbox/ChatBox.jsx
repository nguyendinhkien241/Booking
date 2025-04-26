import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './ChatBox.css';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'AI', text: 'Chào mừng đến với website booking, tôi có thể giúp gì cho bạn' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Scroll to the bottom of the chat body when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Simple Markdown parser to handle bold (**text**) and lists (* text)

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message to the chat
    const userMessage = { sender: 'User', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send the message to the backend
      const response = await axios.post(
        '/chat',
        { message: userMessage.text },
        { withCredentials: true }
      );

      // Add AI's response to the chat
      const aiMessage = { sender: 'AI', text: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);

      // If hotels are returned, add them as a separate message
      if (response.data.hotels && response.data.hotels.length > 0) {
        const hotelsMessage = {
          sender: 'AI',
          hotels: response.data.hotels,
        };
        setMessages((prev) => [...prev, hotelsMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'AI', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox-container">
      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbox-window ${isOpen ? 'open' : ''}`}>
          <div className="chatbox-header">
            <h3>Trợ lý ảo AI</h3>
            <button className="chatbox-close-btn" onClick={toggleChatBox} aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="chatbox-body" ref={chatBodyRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender === 'User' ? 'user-message' : 'ai-message'}`}
              >
                <strong>{message.sender}:</strong>{' '}
                {message.text && <ReactMarkdown>{message.text}</ReactMarkdown>}
                {message.hotels && (
                  <div className="hotel-list">
                    {message.hotels.map((hotel) => (
                      <div key={hotel.id} className="hotel-item">
                        <Link to={`/hotels/${hotel.id}`} className="hotel-link">
                          <strong>{hotel.name}</strong> ({hotel.type}) - {hotel.city}, Price: ${hotel.cheapestPrice}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-message ai-message">
                <strong>AI:</strong>
                <section className="dots-container">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </section>
              </div>
            )}
          </div>
          <div className="chatbox-footer">
            <form onSubmit={handleSendMessage} style={{ display: 'flex', width: '100%' }}>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Gửi yêu cầu của bạn..."
                id="message"
                name="message"
              />
              <button type="submit">Gửi</button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Icon */}
      <div className="chatbox-icon" onClick={toggleChatBox} aria-label="Open chat">
        <FontAwesomeIcon icon={faRobot} />
      </div>
    </div>
  );
};

export default ChatBox;