import React, { useEffect, useRef, useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile, Phone, Video, Info, ArrowLeft, Check, CheckCheck, Reply, X, Trash2 } from 'lucide-react';
import CompanyLayout from '../../components/layouts/CompanyLayout';
import { chatApi } from '@/api/chat.api';
import { socketService } from '@/services/socket.service';
import { useAppSelector } from '@/hooks/useRedux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { ChatMessageResponseDto, ConversationResponseDto } from '@/interfaces/chat';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const deriveDisplayName = (conversation: ConversationResponseDto, selfId: string | null) => {
  const other = conversation.participants.find((p) => p.userId !== selfId);
  return other?.userId || 'Conversation';
};

const getOtherParticipant = (conversation: ConversationResponseDto, selfId: string) => {
  return conversation.participants.find((p) => p.userId !== selfId)?.userId || '';
};

type UiConversation = ConversationResponseDto & { displayName: string; subtitle?: string };
type UiMessage = ChatMessageResponseDto;

const CompanyChat: React.FC = () => {
  const { token, id: userId } = useAppSelector((s) => s.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatIdParam = searchParams.get('chat');
  const [selectedConversation, setSelectedConversation] = useState<UiConversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedConversationRef = useRef<UiConversation | null>(null);
  const userIdRef = useRef<string | null>(null);
  const [conversations, setConversations] = useState<UiConversation[]>([]);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<UiMessage | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  const filteredConversations = conversations.filter(conv =>
    conv.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    
    if (isInitialLoadRef.current && messages.length > 0) {
      scrollToBottom();
      isInitialLoadRef.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      isInitialLoadRef.current = true; 
      setTimeout(() => scrollToBottom('auto'), 100); 
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!token) return;
    const result = await chatApi.getConversations({ page: 1, limit: 50 });
    const mapped = result.data.map((c) => ({
      ...c,
      displayName: deriveDisplayName(c, userId),
      subtitle: c.lastMessage?.content,
    }));
    setConversations(mapped);
    
    // Auto-select conversation if chatId is provided
    if (chatIdParam) {
      const targetConv = mapped.find((c) => c.id === chatIdParam);
      if (targetConv) {
        setSelectedConversation(targetConv);
        socketService.joinConversation(targetConv.id);
        loadMessages(targetConv.id);
      } else {
        navigate('/company/messages', { replace: true });
      }
    }
  };

  const loadMessages = async (conversationId: string, pageNum = 1) => {
    const result = await chatApi.getMessages(conversationId, { page: pageNum, limit: 20 });
    if (pageNum === 1) {
      setMessages(result.data.reverse());
      setPage(1);
      setHasMore(result.page < result.totalPages);
    } else {
      
      setMessages(prev => [...result.data.reverse(), ...prev]);
      setPage(pageNum);
      setHasMore(result.page < result.totalPages);
    }
  };

  const loadMoreMessages = async () => {
    if (!selectedConversation || loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    await loadMessages(selectedConversation.id, nextPage);
    setLoadingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop < 100 && hasMore && !loadingMore) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
      loadConversations().catch(() => {});
    }
  }, [token, chatIdParam]);

  useEffect(() => {
    const onMessage = (payload: any) => {
      if (!payload) return;
      const { conversationId, message, participants } = payload as {
        conversationId: string;
        message: UiMessage;
        participants: string[];
      };

      if (!participants?.includes(userIdRef.current || '')) return;

      setConversations((prev) => {
        const isViewingConversation = selectedConversationRef.current?.id === conversationId;
        const updated = prev.find((c) => c.id === conversationId)
          ? prev.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: {
                      messageId: message.id,
                      senderId: message.senderId,
                      content: message.content,
                      createdAt: message.createdAt,
                    },
                    updatedAt: message.createdAt,
                    participants: c.participants.map((p) =>
                      // Only increment unread count if:
                      // 1. This is the receiver
                      // 2. NOT currently viewing this conversation
                      // 3. Message is from someone else
                      p.userId === message.receiverId && !isViewingConversation && message.senderId !== userIdRef.current
                        ? { ...p, unreadCount: p.unreadCount + 1 }
                        : p,
                    ),
                  }
                : c,
            )
          : prev;
        return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });

      if (selectedConversationRef.current?.id === conversationId) {
        // Add message only if it doesn't already exist (prevent duplicates)
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
        
        // Automatically mark as read if we're viewing this conversation
        if (message.senderId !== userIdRef.current) {
          chatApi.markAsRead(conversationId).catch(() => {});
          socketService.emitMarkAsRead({ conversationId });
        }
      }
    };

    const onMessagesRead = (payload: any) => {
      const { conversationId } = payload || {};
      if (!conversationId) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, participants: c.participants.map((p) => ({ ...p, unreadCount: 0 })) }
            : c,
        ),
      );
      if (selectedConversationRef.current?.id === conversationId) {
        setMessages((prev) => prev.map((m) => ({ ...m, status: 'read', readAt: m.readAt || new Date().toISOString() })));
      }
    };

    const onTyping = (payload: any) => {
      const { conversationId, senderId } = payload || {};
      if (!conversationId || !selectedConversationRef.current || conversationId !== selectedConversationRef.current.id) return;
      if (senderId === userIdRef.current) return; // Don't show typing for own messages
      
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    };

    const onMessageDeleted = (payload: any) => {
      const { conversationId, messageId } = payload || {};
      if (!conversationId) return;

      if (selectedConversationRef.current?.id === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m
          )
        );
      }
      
      setConversations((prev) =>
        prev.map((c) => {
           if (c.id === conversationId && c.lastMessage?.messageId === messageId) {
             return {
               ...c,
               lastMessage: {
                 ...c.lastMessage,
                 content: 'This message was deleted'
               }
             }
           }
           return c;
        })
      );
    };

    socketService.onMessageReceived(onMessage);
    socketService.onMessagesRead(onMessagesRead);
    socketService.onTyping(onTyping);
    socketService.onMessageDeleted(onMessageDeleted);

    return () => {
      socketService.offMessageReceived(onMessage);
      socketService.offMessagesRead(onMessagesRead);
      socketService.offTyping(onTyping);
      socketService.offMessageDeleted(onMessageDeleted);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []); 

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation || !userId) return;
    const content = messageText.trim();
    setMessageText('');
    setReplyingTo(null); // Clear reply state

    chatApi
      .sendMessage({
        content,
        receiverId: getOtherParticipant(selectedConversation, userId),
        conversationId: selectedConversation.id,
        replyToMessageId: replyingTo?.id,
      })
      .then(({ conversation }) => {
        // Update conversation list with latest data
        setConversations((prev) => {
          const merged = prev.some((c) => c.id === conversation.id)
            ? prev.map((c) =>
                c.id === conversation.id
                  ? {
                      ...c,
                      lastMessage: conversation.lastMessage || c.lastMessage,
                      participants: conversation.participants,
                      updatedAt: conversation.updatedAt,
                    }
                  : c,
              )
            : [
                {
                  ...conversation,
                  displayName: deriveDisplayName(conversation, userId),
                  subtitle: conversation.lastMessage?.content,
                },
                ...prev,
              ];
          return merged.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        });

        setTimeout(() => scrollToBottom('smooth'), 100);
      })
      .catch(() => {
        setMessageText(content);
      });
  };

  const handleTyping = () => {
    if (!selectedConversation || !userId) return;
    const receiverId = getOtherParticipant(selectedConversation, userId);
    socketService.emitTyping({
      conversationId: selectedConversation.id,
      receiverId,
    });
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

  const formatMessageTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeleteClick = (messageId: string) => {
    setMessageToDelete(messageId);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      await chatApi.deleteMessage(messageToDelete);
      // Optimistic update
      setMessages((prev) =>
        prev.map((m) => (m.id === messageToDelete ? { ...m, isDeleted: true, content: 'This message was deleted' } : m))
      );
    } catch (error) {
      console.error('Failed to delete message:', error);
    } finally {
      setMessageToDelete(null);
    }
  };

  const handleSelectConversation = async (conversation: UiConversation) => {
    setSelectedConversation(conversation);
    socketService.joinConversation(conversation.id);
    await loadMessages(conversation.id);
    await chatApi.markAsRead(conversation.id).catch(() => {});
    socketService.emitMarkAsRead({ conversationId: conversation.id });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id
          ? { ...c, participants: c.participants.map((p) => ({ ...p, unreadCount: 0 })) }
          : c,
      ),
    );
  };

  const selfId = userId || '';

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
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-gray-100 bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {conversation.displayName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conversation.displayName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {conversation.lastMessage?.createdAt ? formatTime(new Date(conversation.lastMessage.createdAt)) : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-primary font-medium truncate">
                        {conversation.subtitle || 'Chat'}
                      </p>
                      {conversation.participants.some((p) => p.userId === selfId && p.unreadCount > 0) && (
                        <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {conversation.participants.find((p) => p.userId === selfId)?.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.content}</p>
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
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.displayName}`}
                        alt={selectedConversation.displayName}
                        className="w-10 h-10 rounded-full border-2 border-gray-100"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">
                      {selectedConversation.displayName}
                      </h2>
                    <p className="text-xs text-gray-500">
                      {isTyping ? (
                        <span className="text-primary font-medium">typing...</span>
                      ) : onlineUsers.has(getOtherParticipant(selectedConversation, userId || '')) ? (
                        <span className="text-green-500">● Online</span>
                      ) : (
                        selectedConversation.subtitle || 'Offline'
                      )}
                    </p>
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
              <div ref={messagesContainerRef} onScroll={handleScroll} className="absolute top-[73px] bottom-[89px] left-0 right-0 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
                <div className="p-6 space-y-4">
                  {loadingMore && (
                    <div className="flex justify-center py-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading messages...
                      </div>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`group flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                        message.senderId === selfId ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {message.senderId !== selfId && (
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.displayName}`}
                          alt={selectedConversation.displayName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div className={`flex flex-col max-w-[65%] ${message.senderId === selfId ? 'items-end' : ''}`}>
                        <div className="relative">
                          <div
                            className={`px-4 py-2.5 ${
                              message.senderId === selfId
                                ? 'bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl rounded-br-sm'
                                : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm'
                            }`}
                          >                          {/* Quoted Message */}
                            {message.replyToMessageId && !message.isDeleted && (
                              <div className="mb-2 pl-2 border-l-2 border-primary/30 bg-gray-50/50 p-2 rounded">
                                <p className="text-xs text-gray-500 mb-0.5">Replying to</p>
                                <p className="text-xs text-gray-700 truncate">
                                  {messages.find(m => m.id === message.replyToMessageId)?.content || 'Message'}
                                </p>
                              </div>
                            )}

                            <p className={`text-sm leading-relaxed ${message.isDeleted ? 'italic text-gray-500' : ''}`}>
                              {message.content}
                            </p>
                          </div>
                          {/* Message Actions */}
                          {!message.isDeleted && (
                            <div className={`absolute -top-2 ${
                              message.senderId === selfId ? '-left-16' : '-right-16'
                            } opacity-0 group-hover:opacity-100 transition-opacity flex gap-2`}>
                               <button
                                onClick={() => setReplyingTo(message)}
                                className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                title="Reply"
                              >
                                <Reply size={12} className="text-gray-600" />
                              </button>
                              {message.senderId === selfId && (
                                <button
                                  onClick={() => handleDeleteClick(message.id)}
                                  className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-red-50"
                                  title="Delete"
                                >
                                  <Trash2 size={12} className="text-red-500" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 px-1">
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(message.createdAt)}
                          </span>
                          {message.senderId === selfId && (
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
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.displayName}`}
                        alt={selectedConversation.displayName}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Fixed Message Input */}
              <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white">
                {/* Reply Preview */}
                {replyingTo && (
                  <div className="px-6 pt-3 pb-2 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-start gap-2">
                      <Reply size={14} className="text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">Replying to</p>
                        <p className="text-sm text-gray-700 truncate">{replyingTo.content}</p>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="w-5 h-5 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                        title="Cancel reply"
                      >
                        <X size={12} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors" title="Attach File">
                      <Paperclip size={20} />
                    </button>
                    <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => {
                          setMessageText(e.target.value);
                          handleTyping();
                        }}
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
      <ConfirmationDialog
        isOpen={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        onConfirm={confirmDeleteMessage}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </CompanyLayout>
  );
};

export default CompanyChat;
