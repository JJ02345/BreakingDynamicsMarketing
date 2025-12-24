import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Home, Loader2, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AI_BASE_URL, getHeaders } from '../../lib/ai/config';

const CHAT_STORAGE_KEY = 'ai_chat_history';

// System prompt for the AI
const SYSTEM_PROMPT = `Du bist ein hilfreicher KI-Assistent von Breaking Dynamics. Du hilfst Nutzern bei:
- LinkedIn Content-Strategien
- Marketing-Tipps
- Carousel-Erstellung
- Content-Ideen
- Allgemeine Fragen

Antworte freundlich, kompetent und auf Deutsch (oder in der Sprache des Nutzers). Halte Antworten prägnant aber hilfreich.`;

const AIChat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${AI_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          message: userMessage.content,
          history: conversationHistory,
          system: SYSTEM_PROMPT,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || data.message || data.content || 'Entschuldigung, ich konnte keine Antwort generieren.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(language === 'de'
        ? 'Verbindung zum AI-Server fehlgeschlagen. Bitte versuche es erneut.'
        : 'Failed to connect to AI server. Please try again.');

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: language === 'de'
          ? '⚠️ Entschuldigung, ich konnte keine Verbindung herstellen. Der Server ist möglicherweise nicht erreichbar. Bitte versuche es später erneut.'
          : '⚠️ Sorry, I could not connect. The server may be unavailable. Please try again later.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0A0A0B]">
        <div className="flex items-center justify-between h-14 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            <Home className="h-4 w-4 text-[#FF6B35]" />
            <span className="text-sm font-medium text-white hidden sm:inline">
              {language === 'de' ? 'Startseite' : 'Home'}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-semibold hidden sm:inline">AI Chat</span>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-white/70 transition-colors"
            title={language === 'de' ? 'Chat löschen' : 'Clear chat'}
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm hidden sm:inline">
              {language === 'de' ? 'Löschen' : 'Clear'}
            </span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/10 border border-[#FF6B35]/20 flex items-center justify-center mb-6">
              <Bot className="h-10 w-10 text-[#FF6B35]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {language === 'de' ? 'Willkommen beim AI Chat!' : 'Welcome to AI Chat!'}
            </h2>
            <p className="text-white/50 max-w-md">
              {language === 'de'
                ? 'Frag mich alles über LinkedIn Marketing, Content-Strategien, oder lass dir bei deinen Carousels helfen.'
                : 'Ask me anything about LinkedIn marketing, content strategies, or get help with your carousels.'}
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-lg">
              {[
                language === 'de' ? 'Was macht einen guten LinkedIn Post aus?' : 'What makes a good LinkedIn post?',
                language === 'de' ? 'Gib mir 5 Content-Ideen' : 'Give me 5 content ideas',
                language === 'de' ? 'Wie oft sollte ich posten?' : 'How often should I post?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-[#FF6B35] text-white'
                  : message.isError
                    ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                    : 'bg-[#1A1A1D] border border-white/5 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-white/60' : 'text-white/40'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <User className="h-4 w-4 text-white/70" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#FF6B35]" />
                <span className="text-white/50 text-sm">
                  {language === 'de' ? 'Denke nach...' : 'Thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-white/5 bg-[#0A0A0B] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'de' ? 'Schreib deine Nachricht...' : 'Type your message...'}
                className="w-full px-4 py-3 pr-12 bg-[#1A1A1D] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-[#FF6B35]/50 focus:outline-none resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-[#FF6B35] text-white font-medium hover:bg-[#FF8C5A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-center text-white/30 text-xs mt-2">
            {language === 'de'
              ? 'Drücke Enter zum Senden'
              : 'Press Enter to send'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
