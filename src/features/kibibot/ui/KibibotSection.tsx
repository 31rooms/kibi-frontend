'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Send, MessageSquare, Edit2, Star, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';
import { useAuth } from '@/features/authentication';
import { Breadcrumb, Button, Input, KibiIcon, Card, DropdownMenu, ChatBubble, MarkdownRenderer } from '@/shared/ui';
import { useKibibot } from '../hooks/useKibibot';
import type { KibiBotSession, QuickAction } from '../api/types';

/**
 * Kibibot Section Component
 * Chat/Assistant interface with Kibibot
 * Accessible only via the floating Kibibot button (no sidebar/navbar link)
 */

export const KibibotSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    // Use the KibiBot hook for real API integration
    const {
      status,
      sessions,
      currentSession,
      subjects,
      loading,
      sendingMessage,
      error,
      loadSessions,
      createSession,
      loadSession,
      sendMessage,
      selectSubject,
      renameSession,
      toggleFavorite,
      deleteSession,
      clearCurrentSession,
      clearError,
    } = useKibibot();

    // Filter sessions based on search query
    const filteredSessions = sessions.filter((conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentSession?.messages]);

    // Clear error after 5 seconds
    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => clearError(), 5000);
        return () => clearTimeout(timer);
      }
    }, [error, clearError]);

    const handleGoHome = () => {
      router.push('/home');
    };

    const handleNewChat = async () => {
      if (!status?.canCreateNewChat) {
        return;
      }
      await createSession();
    };

    const handleSendMessage = async () => {
      if (message.trim() && !sendingMessage) {
        const messageText = message;
        setMessage('');
        await sendMessage(messageText);
      }
    };

    const handleSelectSubject = async (letter: string) => {
      if (!sendingMessage) {
        await selectSubject(letter);
      }
    };

    const handleStartEditConversation = (session: KibiBotSession, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingSessionId(session._id);
      setEditingTitle(session.title);
    };

    const handleSaveEditConversation = async () => {
      if (editingSessionId && editingTitle.trim()) {
        await renameSession(editingSessionId, editingTitle.trim());
        setEditingSessionId(null);
        setEditingTitle('');
      }
    };

    const handleCancelEdit = () => {
      setEditingSessionId(null);
      setEditingTitle('');
    };

    const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      await toggleFavorite(id);
    };

    const handleDeleteConversation = async (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (confirm('¿Estás seguro de que deseas eliminar esta conversación?')) {
        await deleteSession(id);
      }
    };

    const handleOpenHistoryDrawer = () => {
      setIsHistoryDrawerOpen(true);
    };

    const handleCloseHistoryDrawer = () => {
      setIsHistoryDrawerOpen(false);
    };

    const handleSelectConversation = async (id: string) => {
      await loadSession(id);
      setIsHistoryDrawerOpen(false);
    };

    const handleExitConversation = () => {
      clearCurrentSession();
    };

    const formatDate = (date: Date | string) => {
      const d = new Date(date);
      return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    // Render quick action buttons
    const renderQuickActions = (quickActions?: QuickAction[]) => {
      if (!quickActions || quickActions.length === 0) return null;

      return (
        <div className="flex gap-2 flex-wrap mt-3">
          {quickActions.map((action, index) => (
            <button
              key={`${action.value}-${index}`}
              onClick={() => handleSelectSubject(action.value)}
              disabled={sendingMessage}
              className="px-4 py-2 bg-[var(--color-button-green-default)] text-white rounded-full text-sm hover:bg-[#3a6b0b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {action.label}
            </button>
          ))}
        </div>
      );
    };

    // Render conversation card
    const renderConversationCard = (conversation: KibiBotSession) => (
      <Card
        key={conversation._id}
        variant="default"
        padding="none"
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleSelectConversation(conversation._id)}
      >
        <div className="p-4 flex items-start gap-3">
          {/* Favorite Star */}
          <button
            onClick={(e) => handleToggleFavorite(conversation._id, e)}
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
              {formatDate(conversation.createdAt)}
            </p>

            {/* Kibi Icon and Title */}
            {editingSessionId === conversation._id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEditConversation();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1 text-sm border rounded dark:bg-[#171B22] dark:border-[#374151]"
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEditConversation();
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  ✓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <KibiIcon size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-dark-900 dark:text-white font-[family-name:var(--font-rubik)] line-clamp-2">
                  {conversation.title}
                </p>
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu
            items={[
              {
                label: 'Editar nombre',
                onClick: () => {
                  setEditingSessionId(conversation._id);
                  setEditingTitle(conversation.title);
                },
                icon: <Edit2 className="w-4 h-4" />,
              },
              {
                label: conversation.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito',
                onClick: () => handleToggleFavorite(conversation._id),
                icon: <Star className="w-4 h-4" />,
              },
              {
                label: 'Eliminar',
                onClick: () => handleDeleteConversation(conversation._id),
                icon: <Trash2 className="w-4 h-4" />,
                variant: 'danger',
              },
            ]}
          />
        </div>
      </Card>
    );

    // Loading state
    if (loading) {
      return (
        <main
          ref={ref}
          className={cn(
            "flex-1 overflow-hidden flex flex-col items-center justify-center",
            "bg-white dark:bg-[#0A0F1E]",
            className
          )}
          {...props}
        >
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-button-green-default)]" />
          <p className="mt-4 text-grey-600 dark:text-grey-400">Cargando KibiBot...</p>
        </main>
      );
    }

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
        {/* Error Toast */}
        {error && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        )}

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
          {currentSession ? (
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
                disabled={!status?.canCreateNewChat}
                className="gap-2"
              >
                Nuevo chat
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Limit warning for FREE plan */}
            {status && !status.canCreateNewChat && status.plan === 'FREE' && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {status.reason || `Has alcanzado el límite de ${status.maxSessions} conversaciones del plan Free.`}
                </p>
              </div>
            )}

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
                {filteredSessions.length === 0 ? (
                  <Card variant="default" padding="medium">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-grey-200 dark:bg-[#1E242D] rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-grey-400 dark:text-grey-500" />
                      </div>
                      <p className="text-sm dark:text-grey-400 font-[family-name:var(--font-rubik)]" style={{ color: isDarkMode ? undefined : '#7B7B7B' }}>
                        {searchQuery ? 'No se encontraron conversaciones' : 'No hay conversaciones recientes'}
                      </p>
                    </div>
                  </Card>
                ) : (
                  filteredSessions.map((conversation) => renderConversationCard(conversation))
                )}
              </div>
            </div>
          </aside>

          {/* Right Content - Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8">
              {currentSession ? (
                /* Show chat messages if conversation is selected */
                <div className="max-w-3xl mx-auto">
                  {/* Chat Header - Date and Menu */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm" style={{ color: isDarkMode ? '#9CA3AF' : '#7B7B7B' }}>
                      {formatDate(currentSession.session.createdAt)}
                    </p>
                    <DropdownMenu
                      items={[
                        {
                          label: 'Editar nombre',
                          onClick: () => {
                            setEditingSessionId(currentSession.session._id);
                            setEditingTitle(currentSession.session.title);
                          },
                          icon: <Edit2 className="w-4 h-4" />,
                        },
                        {
                          label: currentSession.session.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito',
                          onClick: () => handleToggleFavorite(currentSession.session._id),
                          icon: <Star className="w-4 h-4" />,
                        },
                        {
                          label: 'Eliminar',
                          onClick: () => handleDeleteConversation(currentSession.session._id),
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: 'danger',
                        },
                      ]}
                    />
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-1">
                    {currentSession.messages.map((msg, index) => (
                      <ChatBubble
                        key={`${msg.timestamp}-${index}`}
                        sender={msg.role === 'USER' ? 'user' : 'kibibot'}
                        avatar={
                          msg.role !== 'USER' ? (
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
                        <MarkdownRenderer content={msg.content} />
                        {msg.recommendedLesson && (
                          <a
                            href={msg.recommendedLesson.url}
                            className="inline-block mt-2 text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            📚 {msg.recommendedLesson.title}
                          </a>
                        )}
                        {renderQuickActions(msg.quickActions)}
                      </ChatBubble>
                    ))}

                    {/* Sending indicator */}
                    {sendingMessage && (
                      <ChatBubble
                        sender="kibibot"
                        avatar={<KibiIcon size={32} />}
                      >
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-grey-500">Escribiendo...</span>
                        </div>
                      </ChatBubble>
                    )}

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
                        Hola{user?.firstName ? ` ${user.firstName}` : ''}, charlemos un poco, estoy aquí para responder todas tus preguntas
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

                  {/* Subject Buttons */}
                  {subjects.length > 0 && (
                    <div className="w-full flex flex-col items-center">
                      <p className="text-center text-dark-900 dark:text-white mb-4 font-[family-name:var(--font-rubik)]">
                        ¿Qué asignatura te interesa?
                      </p>

                      <div className="flex flex-wrap gap-3 justify-center">
                        {subjects.map((subject) => (
                          <Button
                            key={subject.letter}
                            variant="primary"
                            color="green"
                            size="medium"
                            onClick={() => {
                              // Create a new session and then select the subject
                              createSession().then((response) => {
                                if (response) {
                                  selectSubject(subject.letter);
                                }
                              });
                            }}
                            disabled={!status?.canCreateNewChat}
                          >
                            {subject.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  <div className="w-full flex flex-col items-center mt-8">
                    <p className="text-center text-grey-600 dark:text-grey-400 mb-4 font-[family-name:var(--font-rubik)]">
                      O empieza con una de estas sugerencias
                    </p>

                    <div className="space-y-3 flex flex-col items-center w-full">
                      <Button
                        variant="secondary"
                        color="green"
                        size="medium"
                        className="max-w-[280px] w-full"
                        onClick={handleNewChat}
                        disabled={!status?.canCreateNewChat}
                      >
                        Quiero aprender algo nuevo
                      </Button>

                      <Button
                        variant="secondary"
                        color="green"
                        size="medium"
                        className="max-w-[340px] w-full py-3"
                        onClick={handleNewChat}
                        disabled={!status?.canCreateNewChat}
                      >
                        Tengo dudas de mi proceso de admisión
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input - Fixed at bottom (only show when session is active) */}
            {currentSession && (
              <div className="p-6" style={{ borderTop: isDarkMode ? '1px solid #374151' : '1px solid #DEE2E6' }}>
                <div className="max-w-4xl mx-auto">
                  <div className="relative flex items-center gap-3">
                    <Input
                      placeholder="Escribe aquí tu mensaje"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={sendingMessage}
                      className="flex-1"
                    />

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sendingMessage}
                      className={cn(
                        "p-3 rounded-full transition-all",
                        message.trim() && !sendingMessage
                          ? "bg-[var(--color-button-green-default)] text-white hover:bg-[#3a6b0b]"
                          : "bg-grey-300 dark:bg-grey-700 text-grey-500 cursor-not-allowed"
                      )}
                      aria-label="Enviar mensaje"
                    >
                      {sendingMessage ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                  disabled={!status?.canCreateNewChat}
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

                {/* Limit warning for FREE plan */}
                {status && !status.canCreateNewChat && status.plan === 'FREE' && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {status.reason || `Has alcanzado el límite de ${status.maxSessions} conversaciones del plan Free.`}
                    </p>
                  </div>
                )}

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
                    {filteredSessions.length === 0 ? (
                      <Card variant="default" padding="medium">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-grey-200 dark:bg-[#1E242D] rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-grey-400 dark:text-grey-500" />
                          </div>
                          <p className="text-sm dark:text-grey-400 font-[family-name:var(--font-rubik)]" style={{ color: isDarkMode ? undefined : '#7B7B7B' }}>
                            {searchQuery ? 'No se encontraron conversaciones' : 'No hay conversaciones recientes'}
                          </p>
                        </div>
                      </Card>
                    ) : (
                      filteredSessions.map((conversation) => renderConversationCard(conversation))
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
