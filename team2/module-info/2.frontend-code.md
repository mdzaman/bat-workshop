Frontend code 

I'll modify the chatbot to be centered on the page with a more refined, professional look.



```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

const CustomerServiceChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 0, 
      text: "Hi there! I'm your customer support assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'd be glad to assist you. Could you provide more details about your issue?";
    }
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost')) {
      return "Our pricing information is available on our website. Would you like me to guide you?";
    }
    
    if (lowerMessage.includes('product')) {
      return "We have a variety of products. Which one are you interested in learning about?";
    }
    
    return "I'm not quite sure I understand. Could you rephrase your question?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length,
      text: inputMessage,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 1,
        text: generateBotResponse(inputMessage),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center">
          <MessageCircle className="mr-3" />
          <h2 className="text-xl font-semibold">Customer Support</h2>
        </div>

        {/* Messages Container */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] p-3 rounded-xl shadow-sm 
                  ${msg.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'}
                  transition-all duration-300 ease-in-out
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white flex items-center">
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow mr-3 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceChatbot;

```

Key improvements in this version:

1. **Centered Design**:
   - Full-screen centered layout
   - Soft gray background
   - Centered chat window with smooth shadow

2. **Enhanced Styling**:
   - Gradient header
   - Rounded components
   - Subtle shadows
   - Smooth transitions
   - Improved color scheme

3. **Responsive Considerations**:
   - Max-width for better mobile and desktop experience
   - Flexible layout
   - Improved readability

4. **UI/UX Enhancements**:
   - Softer message bubbles
   - Focus states on input
   - Subtle animations
   - More professional color palette

Differences from previous version:
- Centered on page
- More polished look
- Improved color scheme
- Better use of white space
- More modern design approach
