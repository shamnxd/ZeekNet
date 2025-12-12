import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile, Phone, Video, Info, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import CompanyLayout from '../../components/layouts/CompanyLayout';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  applicantName: string;
  applicantAvatar: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

const CompanyChat: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      applicantName: 'Sarah Johnson',
      applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      jobTitle: 'Senior Frontend Developer',
      lastMessage: 'Thank you for considering my application!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      applicantName: 'Michael Chen',
      applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      jobTitle: 'UX Designer',
      lastMessage: 'I would love to discuss the role further',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: '3',
      applicantName: 'Emily Rodriguez',
      applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      jobTitle: 'Backend Engineer',
      lastMessage: 'When can we schedule an interview?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: '4',
      applicantName: 'David Kim',
      applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      jobTitle: 'Full Stack Developer',
      lastMessage: 'Looking forward to hearing from you',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
      unreadCount: 0,
      isOnline: false,
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      text: 'Hello! I saw your job posting for Senior Frontend Developer and I\'m very interested.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'read',
    },
    {
      id: '2',
      senderId: 'company',
      text: 'Hi Sarah! Thank you for your interest. I\'ve reviewed your application and I\'m impressed with your experience.',
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      status: 'read',
    },
    {
      id: '3',
      senderId: '1',
      text: 'Thank you! I have 5 years of experience with React and TypeScript. I\'d love to learn more about the team and the projects.',
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      status: 'read',
    },
    {
      id: '4',
      senderId: 'company',
      text: 'That\'s great! We\'re working on a modern web platform. Would you be available for a video call next week?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'read',
    },
    {
      id: '5',
      senderId: '1',
      text: 'Absolutely! I\'m available Monday through Wednesday afternoons.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: 'read',
    },
    {
      id: '6',
      senderId: '1',
      text: 'Thank you for considering my application!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'delivered',
    },
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message
      setMessageText('');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <CompanyLayout>
      <div className="fixed top-20 bottom-0 left-[235px] right-0 grid grid-cols-[380px_1fr] bg-gray-50">
        {/* Conversations Sidebar */}
        <div className={`bg-white border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Fixed Header */}
          <div className="px-5 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Fixed Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Scrollable Conversations List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex gap-3 p-3 cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary/5 border-l-4 border-primary'
                      : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.applicantAvatar}
                      alt={conversation.applicantName}
                      className="w-12 h-12 rounded-full border-2 border-gray-100"
                    />
                    {conversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conversation.applicantName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-primary font-medium truncate">
                        {conversation.jobTitle}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`relative bg-white ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversation ? (
            <>
              {/* Fixed Chat Header */}
              <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="relative flex-shrink-0">
                      <img
                        src={selectedConversation.applicantAvatar}
                        alt={selectedConversation.applicantName}
                        className="w-10 h-10 rounded-full border-2 border-gray-100"
                      />
                      {selectedConversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                        {selectedConversation.applicantName}
                      </h2>
                      <p className="text-xs text-gray-500">{selectedConversation.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors" title="Voice Call">
                      <Phone size={20} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors" title="Video Call">
                      <Video size={20} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors" title="Info">
                      <Info size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Messages - with padding for fixed header and input */}
              <div className="absolute top-[73px] bottom-[89px] left-0 right-0 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
                <div className="p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                        message.senderId === 'company' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {message.senderId !== 'company' && (
                        <img
                          src={selectedConversation.applicantAvatar}
                          alt={selectedConversation.applicantName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div className={`flex flex-col max-w-[65%] ${message.senderId === 'company' ? 'items-end' : ''}`}>
                        <div
                          className={`px-4 py-2.5 ${
                            message.senderId === 'company'
                              ? 'bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl rounded-br-sm'
                              : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 px-1">
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(message.timestamp)}
                          </span>
                          {message.senderId === 'company' && (
                            <span className="flex items-center">
                              {message.status === 'read' ? (
                                <CheckCheck size={14} className="text-primary" />
                              ) : (
                                <Check size={14} className="text-gray-400" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Fixed Message Input */}
              <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors" title="Attach File">
                    <Paperclip size={20} />
                  </button>
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-500"
                    />
                    <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary transition-colors" title="Emoji">
                      <Smile size={20} />
                    </button>
                  </div>
                  <button
                    className={`w-12 h-12 flex items-center justify-center bg-gradient-to-r from-primary to-primary/90 text-white transition-all ${
                      messageText.trim()
                        ? 'hover:scale-105 hover:rotate-12 active:scale-95'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-6 animate-in fade-in duration-500">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="animate-float">
                  <circle cx="60" cy="60" r="50" fill="currentColor" className="text-primary/10" />
                  <path
                    d="M40 50C40 44.4772 44.4772 40 50 40H70C75.5228 40 80 44.4772 80 50V65C80 70.5228 75.5228 75 70 75H55L45 85V75H50C44.4772 75 40 70.5228 40 65V50Z"
                    fill="currentColor"
                    className="text-primary"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Select a conversation</h2>
              <p className="text-gray-600 max-w-md">
                Choose a conversation from the sidebar to start messaging with applicants
              </p>
            </div>
          )}
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyChat;
