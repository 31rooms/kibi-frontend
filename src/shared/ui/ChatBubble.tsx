'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/lib/context';

export interface ChatBubbleProps {
  /**
   * The sender of the message
   */
  sender: 'user' | 'kibibot';
  /**
   * The message content (supports text, JSX, or React nodes)
   */
  children: React.ReactNode;
  /**
   * Avatar to display (user avatar or KibiIcon component)
   */
  avatar?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ChatBubble Component
 * Reusable chat message bubble with different styles for user and Kibibot
 *
 * **Kibibot bubble:**
 * - Light mode: bg #E7FFE7, text dark
 * - Dark mode: bg #1E242D, text white
 * - Avatar: KibiIcon (left side)
 *
 * **User bubble:**
 * - Light mode: bg #EAF0FE, text #2D68F8
 * - Dark mode: bg #2D68F8, text white
 * - Avatar: User avatar from auth hook (right side)
 *
 * @example
 * ```tsx
 * // Kibibot message
 * <ChatBubble sender="kibibot" avatar={<KibiIcon size={32} />}>
 *   Hola, ¿en qué puedo ayudarte?
 * </ChatBubble>
 *
 * // User message
 * <ChatBubble sender="user" avatar={<img src={user.avatar} />}>
 *   Quiero aprender sobre matemáticas
 * </ChatBubble>
 * ```
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  children,
  avatar,
  className,
}) => {
  const { isDarkMode } = useTheme();

  const isKibibot = sender === 'kibibot';
  const isUser = sender === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isKibibot && 'justify-start',
        isUser && 'justify-end',
        className
      )}
    >
      {/* Avatar - Left side for Kibibot */}
      {isKibibot && avatar && (
        <div className="flex-shrink-0 self-end">
          {avatar}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          'max-w-[70%] px-4 py-3 rounded-[20px]',
          'font-[family-name:var(--font-rubik)]',
          // Kibibot styles
          isKibibot && 'bg-[#E7FFE7] dark:bg-[#1E242D]',
          isKibibot && 'text-dark-900 dark:text-white',
          // User styles
          isUser && isDarkMode && 'bg-[#2D68F8] text-white',
          isUser && !isDarkMode && 'bg-[#EAF0FE] text-[#2D68F8]'
        )}
      >
        <div className="text-sm leading-relaxed">
          {children}
        </div>
      </div>

      {/* Avatar - Right side for User */}
      {isUser && avatar && (
        <div className="flex-shrink-0 self-end">
          {avatar}
        </div>
      )}
    </div>
  );
};
