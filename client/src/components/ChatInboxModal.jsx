import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Car, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Check, 
  CheckCheck,
  Headphones,
  User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { playUiClick } from '../utils/audioEngine';
import toast from 'react-hot-toast';

const INQUIRY_PRESETS = [
  'Is early VIP airport tarmac delivery available?',
  'Can I extend this reservation for 2 additional days?',
  'What are the security deposit and insurance terms?',
  'Is a chauffeur available for this vehicle model?',
];

const ChatInboxModal = ({ isOpen, onClose, activeCarContext = null }) => {
  const { user, axios, setShowLogin } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('concierge'); // 'concierge' or 'host'
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/messages/user');
      if (data?.success && Array.isArray(data?.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
        <div className="bg-white border border-[#E6DFD5] rounded-3xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-14 h-14 bg-[#F7F3EE] rounded-2xl flex items-center justify-center border border-[#E6DFD5]">
            <MessageSquare className="w-7 h-7 text-[#5C3A2E]" />
          </div>
          <h3 className="text-xl font-black uppercase text-[#2B1B14]">Sign In Required</h3>
          <p className="text-xs font-mono text-[#7A5244] uppercase">
            Please sign in to communicate directly with vehicle hosts and VIP concierge dispatch.
          </p>
          <button
            onClick={() => {
              onClose();
              setShowLogin(true);
            }}
            className="w-full py-4 bg-[#2B1B14] hover:bg-[#5C3A2E] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-md"
          >
            Sign In Now
          </button>
          <button
            onClick={onClose}
            className="text-xs text-[#7A5244] hover:text-[#2B1B14] font-mono uppercase cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    try {
      playUiClick(700);
      setLoading(true);

      const payload = {
        text: text.trim(),
        carId: activeCarContext?._id || null,
      };

      const { data } = await axios.post('/api/messages/send', payload);

      if (data?.success) {
        setInputText('');
        setMessages((prev) => [...prev, data.data]);
        playUiClick(900);
      } else {
        toast.error(data?.message || 'Failed to dispatch message');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl h-[620px] bg-white border border-[#E6DFD5] rounded-3xl shadow-[0_24px_70px_rgba(43,27,20,0.2)] flex flex-col overflow-hidden text-[#2B1B14]"
      >
        {/* Header */}
        <div className="p-5 bg-[#2B1B14] text-white flex items-center justify-between border-b border-[#5C3A2E]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5C3A2E] flex items-center justify-center border border-[#B98B73]/30">
              <Headphones className="w-5 h-5 text-[#B98B73]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-wider">Fleet Concierge & Host Direct</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[8px] font-mono uppercase font-bold">
                  Live Dispatch
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#EAE3D9] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected with 24/7 White-Glove Support Team</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#EAE3D9] hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attached Context Banner if messaging about a specific car */}
        {activeCarContext && (
          <div className="px-5 py-2.5 bg-[#F7F3EE] border-b border-[#E6DFD5] flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 truncate">
              <Car className="w-4 h-4 text-[#5C3A2E] shrink-0" />
              <span className="text-[#7A5244] uppercase font-bold">Regarding:</span>
              <span className="text-[#2B1B14] font-black uppercase truncate">
                {activeCarContext.title || `${activeCarContext.brand} ${activeCarContext.model}`}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#5C3A2E] uppercase shrink-0">
              {activeCarContext.pricePerDay || activeCarContext.price} / Day
            </span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#FCFAF7] flex flex-col gap-4 text-xs font-mono">
          {/* Welcome Dispatch Message */}
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="p-4 bg-white border border-[#E6DFD5] rounded-2xl rounded-bl-xs shadow-xs font-sans text-xs text-[#2B1B14] leading-relaxed">
              <p className="font-bold text-[11px] font-mono text-[#5C3A2E] uppercase mb-1">
                TERACAR VIP Concierge Desk
              </p>
              Welcome to the private member messaging dispatch. Our team and vehicle hosts are standing by to assist with reservation customizations, airport logistics, and bespoke delivery coordination.
            </div>
            <span className="text-[9px] text-[#7A5244] font-mono mt-1 pl-1">24/7 Verified Concierge</span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}
              >
                <div
                  className={`p-4 rounded-2xl ${
                    isMe
                      ? 'bg-[#2B1B14] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#2B1B14] border border-[#E6DFD5] rounded-bl-xs shadow-xs font-sans'
                  }`}
                >
                  {!isMe && (
                    <p className="font-bold text-[10px] font-mono text-[#5C3A2E] uppercase mb-1">
                      {msg.sender?.name || 'Vehicle Host'}
                    </p>
                  )}
                  <p className="leading-relaxed text-xs">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] text-[#7A5244] font-mono">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#5C3A2E]" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Inquiry Preset Chips */}
        <div className="px-4 py-2 bg-white border-t border-[#E6DFD5] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {INQUIRY_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(preset)}
              className="px-3 py-1 bg-[#F7F3EE] hover:bg-[#EAE3D9] text-[#2B1B14] border border-[#E6DFD5] rounded-lg text-[9px] font-mono whitespace-nowrap cursor-pointer transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-white border-t border-[#E6DFD5] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to vehicle host / concierge..."
            className="flex-1 bg-[#F7F3EE] border border-[#E6DFD5] rounded-xl px-4 py-3 text-xs font-mono text-[#2B1B14] placeholder:text-[#7A5244]/60 outline-none focus:border-[#5C3A2E] focus:bg-white transition-all font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-[#2B1B14] hover:bg-[#5C3A2E] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatInboxModal;
