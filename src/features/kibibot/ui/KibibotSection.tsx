'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Paperclip, Smile, Send, MessageSquare, Edit2, Star, Trash2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { useAuth } from '@/features/authentication';
import { Breadcrumb, Button, Input, KibiIcon, Card, DropdownMenu, ChatBubble } from '@/shared/ui';

/**
 * Kibibot Section Component
 * Chat/Assistant interface with Kibibot
 * Accessible only via the floating Kibibot button (no sidebar/navbar link)
 */
// Mock conversation type
interface Conversation {
  id: string;
  title: string;
  date: string;
  isFavorite: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'kibibot';
  content: React.ReactNode;
  timestamp: string;
}

export const KibibotSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

    // Mock conversations state
    const [conversations, setConversations] = useState<Conversation[]>([
      {
        id: '1',
        title: 'Quiero leer contenido de ciencias',
        date: '11/11/25',
        isFavorite: true,
      },
      {
        id: '2',
        title: 'Quiero leer contenido de ciencias',
        date: '10/11/25',
        isFavorite: false,
      },
      {
        id: '3',
        title: 'Quiero leer contenido de ciencias',
        date: '09/11/25',
        isFavorite: false,
      },
    ]);

    // Selected conversation (default to first one if conversations exist)
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
      conversations.length > 0 ? conversations[0].id : null
    );

    // Messages state for the selected conversation
    const [messages, setMessages] = useState<ChatMessage[]>([
      {
        id: 'm1',
        sender: 'kibibot',
        content: (
          <>
            <p className="mb-2">Hola Yohanna, puedo recomendarte contenido interesante.</p>
            <p className="mb-3">¿Qué asignatura te interesa?</p>
            <div className="flex gap-2 flex-wrap">
              <button className="px-4 py-2 bg-[var(--color-button-green-default)] text-white rounded-full text-sm hover:bg-[#3a6b0b] transition-colors">
                Matemática
              </button>
              <button className="px-4 py-2 bg-[var(--color-button-green-default)] text-white rounded-full text-sm hover:bg-[#3a6b0b] transition-colors">
                Ciencias
              </button>
            </div>
          </>
        ),
        timestamp: '10:30',
      },
      {
        id: 'm2',
        sender: 'user',
        content: 'Ciencias',
        timestamp: '10:31',
      },
      {
        id: 'm3',
        sender: 'kibibot',
        content: (
          <>
            <p className="mb-2">Te recomiendo leas el siguiente contenido, acorde con tu nivel</p>
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
            >
              Leyes de la conservación de la energía
            </a>
          </>
        ),
        timestamp: '10:32',
      },
      {
        id: 'm4',
        sender: 'user',
        content: 'Gracias',
        timestamp: '10:33',
      },
      {
        id: 'm5',
        sender: 'kibibot',
        content: 'A la orden, recuerda que para fortalecer tus habilidades te explicaré paso a paso cómo resolver cada ejercicio.',
        timestamp: '10:34',
      },
    ]);

    const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleGoHome = () => {
      router.push('/home');
    };

    const handleNewChat = () => {
      console.log('New chat clicked');
    };

    const handleSendMessage = () => {
      if (message.trim()) {
        // Get current time
        const now = new Date();
        const timestamp = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Add user message
        const userMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: 'user',
          content: message,
          timestamp,
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage('');

        // Simulate Kibibot response after a delay
        setTimeout(() => {
          const kibibotMessage: ChatMessage = {
            id: `msg-${Date.now()}-bot`,
            sender: 'kibibot',
            content: '¡Entendido! ¿En qué más puedo ayudarte?',
            timestamp: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
          };
          setMessages((prev) => [...prev, kibibotMessage]);
        }, 1500);
      }
    };

    const handleEditConversation = (id: string) => {
      console.log('Edit conversation:', id);
      // TODO: Implement edit functionality
    };

    const handleToggleFavorite = (id: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, isFavorite: !conv.isFavorite } : conv
        )
      );
    };

    const handleDeleteConversation = (id: string) => {
      console.log('Delete conversation:', id);
      console.log(user)
      // TODO: Implement delete confirmation and logic
    };

    const handleOpenHistoryDrawer = () => {
      setIsHistoryDrawerOpen(true);
    };

    const handleCloseHistoryDrawer = () => {
      setIsHistoryDrawerOpen(false);
    };

    const handleSelectConversation = (id: string) => {
      setSelectedConversationId(id);
      setIsHistoryDrawerOpen(false); // Close drawer when selecting a conversation
    };

    const handleExitConversation = () => {
      setSelectedConversationId(null);
    };

    return (
      <main
        ref={ref}
        className={cn(
          "flex-1 overflow-hidden flex flex-col",
          "bg-white dark:bg-[#0A0F1E]",
          className
        )}
        {...props}
      >
        {/* Mobile Header - Only visible on mobile */}
        <div className="flex md:hidden items-center justify-between p-4 border-b" style={{ borderColor: isDarkMode ? '#374151' : '#DEE2E6' }}>
          {/* Volver Button - Always visible on mobile */}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 text-dark-900 dark:text-white hover:text-[#47830E] dark:hover:text-[#95C16B] transition-colors"
            aria-label="Volver a inicio"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver</span>
          </button>

          {/* Conditional Right Button */}
          {selectedConversation ? (
            /* Salir Button - When conversation is selected */
            <button
              onClick={handleExitConversation}
              className="flex items-center gap-2 text-grey-700 hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100 transition-colors"
              aria-label="Salir de la conversación"
            >
              <Image
                src="/icons/close-square.svg"
                alt="Salir"
                width={20}
                height={20}
              />
              <span className="text-sm font-medium">Salir</span>
            </button>
          ) : (
            /* Historial Button - When no conversation selected */
            <Button
              variant="secondary"
              color="green"
              size="small"
              onClick={handleOpenHistoryDrawer}
            >
              Historial
            </Button>
          )}
        </div>

        {/* Breadcrumb - Desktop only */}
        <div className="hidden md:block p-8 pb-0">
          <Breadcrumb
            items={[
              { label: 'Inicio', onClick: handleGoHome },
              { label: 'Kibibot', isActive: true }
            ]}
          />
        </div>

        {/* Container with two columns */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Desktop only */}
          <aside
            className="hidden md:flex w-[388px] flex-shrink-0 flex-col p-8 pt-4 overflow-y-auto scrollbar-hide"
            style={{ borderRight: isDarkMode ? '1px solid #374151' : '1px solid #DEE2E6' }}
          >
            {/* Title and New Chat Button in same row */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold font-[family-name:var(--font-quicksand)]" style={{ color: '#47830E' }}>
                Kibibot
              </h1>

              <Button
                variant="secondary"
                color="green"
                size="small"
                onClick={handleNewChat}
                className="gap-2"
              >
                Nuevo chat
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[48px] rounded-lg pl-10 pr-3 text-sm border border-grey-300 bg-white text-grey-900 hover:border-grey-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none dark:bg-[#171B22] dark:text-white dark:border-[#374151] dark:hover:border-grey-600 placeholder:text-grey-400 dark:placeholder:text-grey-600"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {/* Section Title */}
              <h2 className="text-sm font-medium mb-3" style={{ color: isDarkMode ? '#fff' : '#7B7B7B' }}>
                Reciente
              </h2>

              {/* Conversations */}
              <div className="space-y-3">
                {conversations.length === 0 ? (
                  <Card variant="default" padding="medium">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-grey-200 dark:bg-[#1E242D] rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-grey-400 dark:text-grey-500" />
                      </div>
                      <p className="text-sm dark:text-grey-400 font-[family-name:var(--font-rubik)]" style={{ color: isDarkMode ? undefined : '#7B7B7B' }}>
                        No hay conversaciones recientes
                      </p>
                    </div>
                  </Card>
                ) : (
                  conversations.map((conversation) => (
                    <Card
                      key={conversation.id}
                      variant="default"
                      padding="none"
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleSelectConversation(conversation.id)}
                    >
                      <div className="p-4 flex items-start gap-3">
                        {/* Favorite Star */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(conversation.id);
                          }}
                          className="flex-shrink-0 mt-1"
                          aria-label={conversation.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
                        >
                          <Image
                            src="/icons/star-50-yellow.svg"
                            alt="Favorito"
                            width={20}
                            height={20}
                            style={{ opacity: conversation.isFavorite ? 1 : 0.3 }}
                          />
                        </button>

                        {/* Conversation Content */}
                        <div className="flex-1 min-w-0">
                          {/* Date */}
                          <p className="text-xs mb-1" style={{ color: isDarkMode ? '#9CA3AF' : '#7B7B7B' }}>
                            {conversation.date}
                          </p>

                          {/* Kibi Icon and Title */}
                          <div className="flex items-start gap-2">
                            <KibiIcon size={20} className="flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] line-clamp-2">
                              {conversation.title}
                            </p>
                          </div>
                        </div>

                        {/* Dropdown Menu */}
                        <DropdownMenu
                          items={[
                            {
                              label: 'Editar nombre',
                              onClick: () => handleEditConversation(conversation.id),
                              icon: <Edit2 className="w-4 h-4" />,
                            },
                            {
                              label: conversation.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito',
                              onClick: () => handleToggleFavorite(conversation.id),
                              icon: <Star className="w-4 h-4" />,
                            },
                            {
                              label: 'Eliminar',
                              onClick: () => handleDeleteConversation(conversation.id),
                              icon: <Trash2 className="w-4 h-4" />,
                              variant: 'danger',
                            },
                          ]}
                        />
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Right Content - Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
              {selectedConversation ? (
                /* Show chat messages if conversation is selected */
                <div className="max-w-3xl mx-auto">
                  {/* Chat Header - Date and Menu */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm" style={{ color: isDarkMode ? '#9CA3AF' : '#7B7B7B' }}>
                      {selectedConversation.date}
                    </p>
                    <DropdownMenu
                      items={[
                        {
                          label: 'Editar nombre',
                          onClick: () => handleEditConversation(selectedConversation.id),
                          icon: <Edit2 className="w-4 h-4" />,
                        },
                        {
                          label: selectedConversation.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito',
                          onClick: () => handleToggleFavorite(selectedConversation.id),
                          icon: <Star className="w-4 h-4" />,
                        },
                        {
                          label: 'Eliminar',
                          onClick: () => handleDeleteConversation(selectedConversation.id),
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: 'danger',
                        },
                      ]}
                    />
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-1">
                    {messages.map((msg) => (
                      <ChatBubble
                        key={msg.id}
                        sender={msg.sender}
                        avatar={
                          msg.sender === 'kibibot' ? (
                            <KibiIcon size={32} />
                          ) : (
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={user?.profilePhotoUrl || '/illustrations/avatar.svg'}
                                alt="User"
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          )
                        }
                      >
                        {msg.content}
                      </ChatBubble>
                    ))}
                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              ) : (
                /* Show welcome screen if no conversation is selected */
                <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-full">
                  {/* Welcome Message with Triangle */}
                  <div className="mb-8 flex flex-col items-center">
                    {/* Message Bubble */}
                    <div
                      className="relative px-6 py-4 bg-[#E7FFE7] dark:bg-[#1E242D] rounded-[20px] shadow-md mb-4 max-w-[240px]"
                    >
                      <p className="text-dark-900 dark:text-white font-medium text-base leading-snug text-center">
                        Hola, charlemos un poco, estoy aquí para responder todas tus preguntas
                      </p>

                      {/* Triangle pointing down */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
                        style={{
                          borderLeft: '12px solid transparent',
                          borderRight: '12px solid transparent',
                          borderTop: isDarkMode ? '12px solid #1E242D' : '12px solid #E7FFE7',
                        }}
                      />
                    </div>

                    {/* Kibi Icon */}
                    <KibiIcon size={80} />
                  </div>

                  {/* Suggestions */}
                  <div className="w-full flex flex-col items-center">
                    <p className="text-center text-dark-900 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                      Algunas sugerencias para empezar
                    </p>

                    <div className="space-y-3 flex flex-col items-center w-full">
                      <Button
                        variant="primary"
                        color="green"
                        size="medium"
                        className="max-w-[250px] w-full"
                        onClick={() => console.log('Clicked: Quiero aprender algo nuevo')}
                      >
                        Quiero aprender algo nuevo
                      </Button>

                      <Button
                        variant="primary"
                        color="green"
                        size="medium"
                        className="max-w-[340px] w-full py-3"
                        onClick={() => console.log('Clicked: Tengo dudas de mi proceso de admisión')}
                      >
                        Tengo dudas de mi proceso de admisión
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="p-6" style={{ borderTop: isDarkMode ? '1px solid #374151' : '1px solid #DEE2E6' }}>
              <div className="max-w-4xl mx-auto">
                <div className="relative flex items-center gap-3">
                  <Input
                    placeholder="Escribe aquí tu mensaje"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />

                  {/* Action Icons */}
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-grey-600 dark:text-grey-400 hover:text-primary-green transition-colors"
                      aria-label="Adjuntar archivo"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    <button
                      className="p-2 text-grey-600 dark:text-grey-400 hover:text-primary-green transition-colors"
                      aria-label="Agregar emoji"
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className={cn(
                        "p-3 rounded-full transition-all",
                        message.trim()
                          ? "bg-[var(--color-button-green-default)] text-white hover:bg-[#3a6b0b]"
                          : "bg-grey-300 dark:bg-grey-700 text-grey-500 cursor-not-allowed"
                      )}
                      aria-label="Enviar mensaje"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Drawer - Mobile only */}
        {isHistoryDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseHistoryDrawer}
            />

            {/* Drawer */}
            <div
              className="absolute inset-y-0 right-0 w-full bg-white dark:bg-[#0A0F1E] flex flex-col animate-slide-in-right"
              style={{ maxWidth: '100%' }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: isDarkMode ? '#374151' : '#DEE2E6' }}>
                <button
                  onClick={handleCloseHistoryDrawer}
                  className="flex items-center gap-2 text-dark-900 dark:text-white hover:text-[#47830E] dark:hover:text-[#95C16B] transition-colors"
                  aria-label="Cerrar historial"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Volver</span>
                </button>

                <Button
                  variant="secondary"
                  color="green"
                  size="small"
                  onClick={handleNewChat}
                  className="gap-2"
                >
                  Nuevo chat
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Title */}
                <h2 className="text-xl font-bold mb-4" style={{ color: '#47830E' }}>
                  Historial de conversaciones
                </h2>

                {/* Search Input */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                    <input
                      type="text"
                      placeholder="Buscar"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-[48px] rounded-lg pl-10 pr-3 text-sm border border-grey-300 bg-white text-grey-900 hover:border-grey-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none dark:bg-[#171B22] dark:text-white dark:border-[#374151] dark:hover:border-grey-600 placeholder:text-grey-400 dark:placeholder:text-grey-600"
                    />
                  </div>
                </div>

                {/* Conversations List */}
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: isDarkMode ? '#fff' : '#7B7B7B' }}>
                    Reciente
                  </h3>

                  <div className="space-y-3">
                    {conversations.length === 0 ? (
                      <Card variant="default" padding="medium">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-grey-200 dark:bg-[#1E242D] rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-grey-400 dark:text-grey-500" />
                          </div>
                          <p className="text-sm dark:text-grey-400 font-[family-name:var(--font-rubik)]" style={{ color: isDarkMode ? undefined : '#7B7B7B' }}>
                            No hay conversaciones recientes
                          </p>
                        </div>
                      </Card>
                    ) : (
                      conversations.map((conversation) => (
                        <Card
                          key={conversation.id}
                          variant="default"
                          padding="none"
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleSelectConversation(conversation.id)}
                        >
                          <div className="p-4 flex items-start gap-3">
                            {/* Favorite Star */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(conversation.id);
                              }}
                              className="flex-shrink-0 mt-1"
                              aria-label={conversation.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
                            >
                              <Image
                                src="/icons/star-50-yellow.svg"
                                alt="Favorito"
                                width={20}
                                height={20}
                                style={{ opacity: conversation.isFavorite ? 1 : 0.3 }}
                              />
                            </button>

                            {/* Conversation Content */}
                            <div className="flex-1 min-w-0">
                              {/* Date */}
                              <p className="text-xs mb-1" style={{ color: isDarkMode ? '#9CA3AF' : '#7B7B7B' }}>
                                {conversation.date}
                              </p>

                              {/* Kibi Icon and Title */}
                              <div className="flex items-start gap-2">
                                <KibiIcon size={20} className="flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] line-clamp-2">
                                  {conversation.title}
                                </p>
                              </div>
                            </div>

                            {/* Dropdown Menu */}
                            <DropdownMenu
                              items={[
                                {
                                  label: 'Editar nombre',
                                  onClick: () => handleEditConversation(conversation.id),
                                  icon: <Edit2 className="w-4 h-4" />,
                                },
                                {
                                  label: conversation.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito',
                                  onClick: () => handleToggleFavorite(conversation.id),
                                  icon: <Star className="w-4 h-4" />,
                                },
                                {
                                  label: 'Eliminar',
                                  onClick: () => handleDeleteConversation(conversation.id),
                                  icon: <Trash2 className="w-4 h-4" />,
                                  variant: 'danger',
                                },
                              ]}
                            />
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }
);

KibibotSection.displayName = 'KibibotSection';
