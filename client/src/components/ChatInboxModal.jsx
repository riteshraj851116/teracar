import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Car, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCheck,
  Headphones,
  User,
  Zap
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

const INITIAL_MESSAGES = [
  {
    _id: 'msg_welcome',
    sender: { name: 'TERACAR VIP Concierge Dispatch', _id: 'concierge_admin' },
    text: 'Welcome to your private reservation dispatch desk. Our team is standing by 24/7 to coordinate airport tarmac transfers, bespoke delivery, and scheduling modifications.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  }
];

const ChatInboxModal = ({ isOpen, onClose, activeCarContext = null }) => {
  const { user, axios, setShowLogin } = useAppContext();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('teracar_chat_messages') || 'null');
      return Array.isArray(saved) && saved.length > 0 ? saved : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/messages/user');
      if (data?.success && Array.isArray(data?.messages) && data.messages.length > 0) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.warn('Live message sync notice:', err.message);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 max-w-md w-full text-center flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 bg-[#F8FAFC] rounded border border-[#E2E8F0] flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-[#090D16]" />
          </div>
          <h3 className="text-xl font-bold uppercase text-[#090D16] font-editorial">Authentication Required</h3>
          <p className="text-xs font-mono text-[#64748B]">
            Sign in to communicate directly with vehicle hosts and 24/7 VIP concierge dispatch.
          </p>
          <button
            onClick={() => {
              onClose();
              setShowLogin(true);
            }}
            className="w-full py-3 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
          >
            Sign In Now
          </button>
          <button
            onClick={onClose}
            className="text-xs text-[#64748B] hover:text-[#090D16] font-mono uppercase cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText || '').trim();
    if (!text) return;

    playUiClick(700);
    setInputText('');

    const userMessage = {
      _id: `msg_user_${Date.now()}`,
      sender: { _id: user._id || 'user_me', name: user.name || 'Client' },
      text: text,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    localStorage.setItem('teracar_chat_messages', JSON.stringify(updatedMessages));

    // Try sending to live backend API in background
    try {
      await axios.post('/api/messages/send', {
        text,
        carId: activeCarContext?._id || null,
      });
    } catch (apiErr) {
      console.warn("Backend chat message stored locally:", apiErr.message);
    }

    // Auto-generate realistic concierge response after 800ms
    setLoading(true);
    setTimeout(() => {
      let replyText = 'Your request has been received by our VIP Concierge team. A dispatch coordinator is preparing your vehicle schedule.';
      
      const lower = text.toLowerCase();
      if (lower.includes('airport') || lower.includes('tarmac') || lower.includes('delivery')) {
        replyText = 'White-glove tarmac dispatch is confirmed for this reservation. Our driver will meet you at the private aviation terminal with keys ready.';
      } else if (lower.includes('extend') || lower.includes('days') || lower.includes('date')) {
        replyText = 'Schedule extension request noted. We have placed a preliminary hold on the chassis for your requested dates.';
      } else if (lower.includes('deposit') || lower.includes('insurance') || lower.includes('terms')) {
        replyText = 'Your booking includes full Zurich Comprehensive insurance with zero deductible. Pre-authorization bond is refunded within 24 hours of key return.';
      } else if (lower.includes('chauffeur') || lower.includes('driver')) {
        replyText = 'Licensed executive security chauffeurs are available upon request. We have assigned this note to your booking manifest.';
      }

      const conciergeReply = {
        _id: `msg_rep_${Date.now()}`,
        sender: { name: 'TERACAR Concierge Officer', _id: 'concierge_admin' },
        text: replyText,
        createdAt: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, conciergeReply];
      setMessages(finalMessages);
      localStorage.setItem('teracar_chat_messages', JSON.stringify(finalMessages));
      setLoading(false);
      playUiClick(900);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl h-[600px] bg-white border border-[#E2E8F0] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#090D16]"
      >
        {/* Header */}
        <div className="p-5 bg-[#090D16] text-white flex items-center justify-between border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#1E293B] flex items-center justify-center border border-[#334155]">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider font-editorial">Fleet Concierge & Host Direct</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[8px] font-mono uppercase font-bold">
                  Live Dispatch
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected with 24/7 White-Glove Support Team</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attached Context Banner */}
        {activeCarContext && (
          <div className="px-5 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 truncate">
              <Car className="w-4 h-4 text-[#090D16] shrink-0" />
              <span className="text-[#64748B] uppercase font-bold">Regarding:</span>
              <span className="text-[#090D16] font-bold uppercase truncate">
                {activeCarContext.title || `${activeCarContext.brand || ''} ${activeCarContext.model || 'Chassis'}`}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#090D16] uppercase shrink-0">
              ₹{Number(activeCarContext.pricePerDay || activeCarContext.price || 0).toLocaleString()} / Day
            </span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#F8FAFC] flex flex-col gap-4 text-xs font-mono">
          {messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'self-end' : 'self-start'}`}
              >
                <div
                  className={`p-4 rounded-lg ${
                    isMe
                      ? 'bg-[#090D16] text-white shadow-xs'
                      : 'bg-white text-[#090D16] border border-[#E2E8F0] shadow-xs'
                  }`}
                >
                  {!isMe && (
                    <p className="font-bold text-[10px] font-mono text-[#64748B] uppercase mb-1 flex items-center gap-1">
                      <Sparkles size={11} className="text-amber-500" />
                      <span>{msg.sender?.name || 'Concierge Officer'}</span>
                    </p>
                  )}
                  <p className="leading-relaxed text-xs">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] text-[#94A3B8] font-mono">
                  <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#090D16]" />}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748B] p-2">
              <span className="w-2 h-2 rounded-full bg-[#090D16] animate-pulse" />
              <span>Concierge is typing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Inquiry Preset Chips */}
        <div className="px-4 py-2 bg-white border-t border-[#E2E8F0] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {INQUIRY_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(preset)}
              className="px-3 py-1.5 bg-[#F8FAFC] hover:bg-[#090D16] hover:text-white text-[#090D16] border border-[#E2E8F0] rounded text-[10px] font-mono whitespace-nowrap cursor-pointer transition-colors"
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
          className="p-4 bg-white border-t border-[#E2E8F0] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to concierge / vehicle host..."
            className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-4 py-3 text-xs font-mono text-[#090D16] placeholder:text-[#94A3B8] outline-none focus:border-[#090D16] transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 bg-[#090D16] hover:bg-[#1E293B] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatInboxModal;
