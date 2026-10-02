import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot } from 'lucide-react';
import api, { ChatMessage } from '../services/api';

export const AIConsultChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello. Ask any health or symptom question to receive a direct clinical estimate and triage guidance.\n\nDisclaimer: This is an educational health estimate. Consult a qualified healthcare professional for medical diagnosis and treatment.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await api.consultChat(userMsg.text, messages);
      setMessages([...updatedMessages, { role: 'model', text: response.reply }]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          text: 'Clinical Estimate: Connection temporarily unavailable. Please retry your inquiry.\n\nDisclaimer: This is an educational health estimate. Consult a qualified healthcare professional for medical diagnosis and treatment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const samplePrompts = [
    'How long does a viral fever usually last?',
    'What is normal fasting blood sugar range and estimate?',
    'Estimated recovery time for mild acute bronchitis?',
    'What blood pressure reading is considered Stage 1 Hypertension?',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Clinical Health Assistant</h2>
            <p className="text-xs text-slate-500">
              Ask symptom questions to receive structured clinical estimates and triage guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[560px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-teal-50 text-teal-600 border border-teal-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">Preparing clinical estimate...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0 mr-1">
            Questions:
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-lg text-[11px] text-slate-600 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a medical estimate question (e.g. typical recovery time for cold)..."
              className="flex-1 py-2.5 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-center text-[10px] text-slate-400 mt-2 px-1">
            Educational clinical estimates only. In an emergency, dial local emergency services immediately.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultChat;
