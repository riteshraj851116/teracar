import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { playUiClick } from '../utils/audioEngine';

const QUICK_PROMPTS = [
  '⚡ High-power Track Coupe',
  '💼 Executive SUV for Hub Transit',
  '💰 Optimal Daily Rate Allocations',
  '🏎️ Grand Tourer Weekend Spec',
];

const AiFleetAssistant = () => {
  const { cars, currency, navigate } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Welcome to TERACAR Concierge AI. How may I assist your vehicle selection today?',
      recommendations: [],
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAiResponse = (userQuery) => {
    const q = userQuery.toLowerCase();
    let matchedCars = [];
    let responseText = '';

    if (q.includes('track') || q.includes('hypercar') || q.includes('fast') || q.includes('speed')) {
      matchedCars = cars.filter(c => 
        (c.category?.toLowerCase() === 'supercar' || c.title?.toLowerCase().includes('porsche') || c.title?.toLowerCase().includes('bmw'))
      ).slice(0, 2);
      responseText = 'For track precision and agile chassis performance, consider these allocations:';
    } else if (q.includes('suv') || q.includes('business') || q.includes('executive')) {
      matchedCars = cars.filter(c => 
        (c.category?.toLowerCase() === 'suv' || c.category?.toLowerCase() === 'luxury')
      ).slice(0, 2);
      responseText = 'For executive presence and refined luxury comfort:';
    } else {
      matchedCars = cars.slice(0, 2);
      responseText = `Based on real-time atelier availability, here are top recommendations:`;
    }

    if (matchedCars.length === 0 && cars.length > 0) {
      matchedCars = cars.slice(0, 2);
    }

    return { responseText, matchedCars };
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    playUiClick();

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { responseText, matchedCars } = generateAiResponse(query);
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        recommendations: matchedCars,
      };
      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
      playUiClick();
    }, 500);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => {
          playUiClick();
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#090D16] hover:bg-[#1E293B] text-white rounded-full shadow-lg border border-[#E2E8F0] flex items-center gap-2 cursor-pointer transition-all"
        aria-label="Open Concierge AI"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </div>
        <span className="text-[11px] font-mono uppercase font-bold tracking-wider hidden sm:inline pr-1">
          Concierge AI
        </span>
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] h-[500px] bg-white border border-[#E2E8F0] rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3.5 bg-[#090D16] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-white" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">TERACAR AI Concierge</h4>
                  <p className="text-[8px] font-mono text-[#94A3B8] uppercase">Fleet Intelligence System</p>
                </div>
              </div>

              <button
                onClick={() => { playUiClick(); setIsOpen(false); }}
                className="p-1 text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3.5 overflow-y-auto bg-[#F8FAFC] flex flex-col gap-3 text-xs font-mono">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded ${
                      msg.sender === 'user'
                        ? 'bg-[#090D16] text-white font-mono text-[11px]'
                        : 'bg-white text-[#090D16] border border-[#E2E8F0] text-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5 w-full">
                      {msg.recommendations.map((car) => (
                        <div
                          key={car._id}
                          className="p-2.5 bg-white border border-[#E2E8F0] rounded flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-8 bg-[#F8FAFC] rounded p-1 flex items-center justify-center shrink-0">
                              <img src={car.image} alt={car.title} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-[#090D16] uppercase truncate max-w-[120px]">
                                {car.title || car.model}
                              </span>
                              <span className="text-[9px] font-mono text-[#64748B]">
                                {currency}{car.pricePerDay || car.price}/day
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/car-details/${car._id}`);
                            }}
                            className="p-1.5 bg-[#090D16] text-white rounded text-[9px] font-mono uppercase font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="text-[9px] font-mono uppercase text-[#64748B] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded self-start">
                  Consulting fleet ledger...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Chips */}
            <div className="px-3 py-1.5 bg-white border-t border-[#E2E8F0] flex items-center gap-1 overflow-x-auto scrollbar-none">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-2 py-0.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#090D16] border border-[#E2E8F0] rounded text-[9px] font-mono whitespace-nowrap cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-white border-t border-[#E2E8F0] flex items-center gap-1.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about models, specs, budget..."
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2 text-xs font-mono text-[#090D16] outline-none focus:border-[#090D16]"
              />
              <button
                type="submit"
                className="p-2 bg-[#090D16] text-white rounded cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiFleetAssistant;
