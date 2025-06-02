'use client';
import { useState } from 'react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', content: 'Xin chào! Tôi có thể giúp bạn gợi ý hoa cho dịp đặc biệt nào ạ?' }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chatbot/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      console.log('Chatbot response:', data);

      // Hiển thị suggestion trước
      const botMessages = [
        { role: 'bot', content: data.suggestion }
      ];

      // Hiển thị từng card sản phẩm
      data.cards.forEach(card => {
        if (card.message) {
          botMessages.push({ role: 'bot', content: `${card.flower} – ${card.message}` });
        } else {
          let productLink;
          if (API_BASE_URL.includes("localhost")) {
            productLink = `http://localhost:3000${card.link}`;  // Local dev
          } else {
            productLink = `https://hoatuoiuit.id.vn${card.link}`;  // Production
          }
          botMessages.push({
            role: 'bot',
            content: {
              flower: card.flower,
              productName: card.productName,
              image: card.image,
              link: productLink
            }
          });
        }
      });

      setMessages(prev => [...prev, ...botMessages]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Có lỗi xảy ra. Vui lòng thử lại.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? 'Đóng' : '💬 Chat'}
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-5 pointer-events-none'} w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col border border-pink-300 absolute bottom-16 right-0`}>
        <div className="bg-pink-500 text-white text-center py-2 rounded-t-lg font-bold">🌸 Chat Hoa Tươi UIT 🌸</div>

        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-pink-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg max-w-[75%] ${msg.role === 'user' ? 'bg-yellow-100 text-right' : 'bg-white text-left'}`}>
                {typeof msg.content === 'string' ? (
                  <p>{msg.content}</p>
                ) : (
                  // Hiển thị card sản phẩm
                  <div className="bg-white border rounded-lg p-2 shadow-md">
                    {msg.content.image && (
                      <div className="relative w-[120px] h-[120px] mx-auto mb-2">
                        <Image
                          src={msg.content.image.startsWith('/uploads') ? `${API_BASE_URL}${msg.content.image}` : msg.content.image}
                          alt={msg.content.productName || 'Sản phẩm'}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 100vw, 200px"
                        />
                      </div>
                    )}
                    <h4 className="font-bold text-pink-600 text-center">{msg.content.productName}</h4>
                    <p className="text-sm text-gray-500 text-center">{msg.content.flower}</p>
                    {msg.content.link && (
                      <div className="text-center mt-2">
                        <a href={msg.content.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm hover:text-blue-800">Xem sản phẩm</a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <p className="text-center text-sm text-gray-500">Đang gửi...</p>}
        </div>

        <div className="flex border-t">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Nhập câu hỏi..."
            className="flex-1 p-2 border-none outline-none"
          />
          <button onClick={sendMessage} className="bg-pink-500 text-white px-3 rounded-r-lg">Gửi</button>
        </div>
      </div>
    </div>
  );
}
