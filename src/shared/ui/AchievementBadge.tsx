'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Medal, Target, Zap, Lock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Achievement, AchievementRarity } from '@/features/achievements/api/types';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  animate?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showProgress = true,
  animate = false,
  onClick,
  className
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const isUnlocked = !!achievement.unlockedAt;

  useEffect(() => {
    if (animate && isUnlocked && !achievement.seen) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [animate, isUnlocked, achievement.seen]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'from-yellow-400 to-orange-500';
      case 'EPIC':
        return 'from-purple-400 to-pink-500';
      case 'RARE':
        return 'from-blue-400 to-indigo-500';
      case 'COMMON':
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityGlow = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'shadow-yellow-400/50';
      case 'EPIC':
        return 'shadow-purple-400/50';
      case 'RARE':
        return 'shadow-blue-400/50';
      case 'COMMON':
      default:
        return 'shadow-gray-400/50';
    }
  };

  const getIcon = () => {
    switch (achievement.type) {
      case 'STREAK':
        return Zap;
      case 'SCORE':
        return Trophy;
      case 'MASTERY':
        return Star;
      case 'EXAM':
        return Medal;
      case 'REVIEW':
        return Target;
      case 'SPECIAL':
        return Award;
      default:
        return Trophy;
    }
  };

  const Icon = getIcon();
  const progress = achievement.progress || 0;
  const target = achievement.target || 100;
  const progressPercentage = (progress / target) * 100;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className={cn(
              'w-32 h-32 rounded-full bg-gradient-to-r',
              getRarityColor(achievement.rarity),
              'animate-pulse'
            )} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={isUnlocked ? { scale: 1.1 } : { scale: 1.05 }}
        whileTap={isUnlocked ? { scale: 0.95 } : { scale: 1 }}
        className={cn(
          'relative flex items-center justify-center rounded-full',
          sizeClasses[size],
          isUnlocked ? 'bg-gradient-to-br' : 'bg-gray-200 dark:bg-gray-700',
          isUnlocked && getRarityColor(achievement.rarity),
          isUnlocked && 'shadow-lg',
          isUnlocked && getRarityGlow(achievement.rarity),
          !isUnlocked && 'opacity-60'
        )}
      >
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className={cn(iconSizes[size], 'text-gray-400')} />
          </div>
        )}

        {isUnlocked && (
          <Icon className={cn(iconSizes[size], 'text-white')} />
        )}

        {showProgress && !isUnlocked && progressPercentage > 0 && (
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-300 dark:text-gray-600"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progressPercentage * 2.827} 282.7`}
              className="text-primary transition-all duration-300"
            />
          </svg>
        )}
      </motion.div>

      <div className="mt-2 text-center max-w-[120px]">
        <h4 className={cn(
          'font-semibold text-sm',
          isUnlocked ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {achievement.title}
        </h4>
        {showProgress && !isUnlocked && (
          <p className="text-xs text-muted-foreground mt-1">
            {progress}/{target}
          </p>
        )}
        {isUnlocked && (
          <p className="text-xs text-muted-foreground mt-1">
            +{achievement.points} pts
          </p>
        )}
      </div>
    </div>
  );
};