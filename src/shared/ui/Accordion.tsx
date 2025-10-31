'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

// ============================================================================
// VARIANTS
// ============================================================================

const accordionRootVariants = cva(
  'space-y-4',
  {
    variants: {
      variant: {
        default: '',
        minimal: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const accordionItemVariants = cva(
  'w-full rounded-lg border border-grey-300 dark:border-[#374151] bg-white dark:bg-[#1E242D] overflow-hidden',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'border-0 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const accordionTriggerVariants = cva(
  'flex w-full items-center justify-between py-4 px-6 text-left transition-all hover:bg-grey-50 dark:hover:bg-[#272E3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const accordionContentVariants = cva(
  'overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
  {
    variants: {
      variant: {
        default: '',
        minimal: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// ============================================================================
// PRIMITIVE COMPONENTS (For flexible usage with children)
// ============================================================================

export interface AccordionRootProps
  extends VariantProps<typeof accordionRootVariants> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  disabled?: boolean;
  dir?: 'ltr' | 'rtl';
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  children?: React.ReactNode;
}

/**
 * AccordionRoot - Root wrapper for accordion items
 *
 * @example
 * ```tsx
 * <AccordionRoot type="multiple" defaultValue={['item-1', 'item-2']}>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Title</AccordionTrigger>
 *     <AccordionContent>Content with markdown support</AccordionContent>
 *   </AccordionItem>
 * </AccordionRoot>
 * ```
 */
export const AccordionRoot = React.forwardRef<
  HTMLDivElement,
  AccordionRootProps
>(({ className, variant, type = 'single', ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    type={type as any}
    className={cn(accordionRootVariants({ variant }), className)}
    {...props as any}
  />
));
AccordionRoot.displayName = 'AccordionRoot';

export interface AccordionItemProps
  extends VariantProps<typeof accordionItemVariants> {
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * AccordionItem - Individual accordion item
 *
 * @example
 * ```tsx
 * <AccordionItem value="item-1">
 *   <AccordionTrigger>Title</AccordionTrigger>
 *   <AccordionContent>Content</AccordionContent>
 * </AccordionItem>
 * ```
 */
export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

export interface AccordionTriggerProps
  extends VariantProps<typeof accordionTriggerVariants> {
  /**
   * Hide the chevron icon
   */
  hideIcon?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * AccordionTrigger - Clickable trigger for accordion items
 *
 * @example
 * ```tsx
 * <AccordionTrigger>
 *   <h3>My Title</h3>
 * </AccordionTrigger>
 * ```
 */
export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, variant, children, hideIcon = false, ...props }, ref) => (
  <AccordionPrimitive.Trigger
    ref={ref}
    className={cn(accordionTriggerVariants({ variant }), className)}
    {...props}
  >
    {children}
    {!hideIcon && (
      <ChevronDown className="h-5 w-5 text-dark-600 dark:text-grey-400 transition-transform duration-200 shrink-0 ml-4" />
    )}
  </AccordionPrimitive.Trigger>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export interface AccordionContentProps
  extends VariantProps<typeof accordionContentVariants> {
  /**
   * Render content as markdown (uses MarkdownRenderer)
   */
  markdown?: boolean;
  forceMount?: true;
  className?: string;
  children?: React.ReactNode;
}

/**
 * AccordionContent - Content area for accordion items
 * Supports both plain children and markdown rendering
 *
 * @example
 * ```tsx
 * // With children
 * <AccordionContent>
 *   <div>Custom content</div>
 * </AccordionContent>
 *
 * // With markdown support
 * <AccordionContent markdown>
 *   # Title
 *   This is **bold** with $x^2$ LaTeX
 * </AccordionContent>
 * ```
 */
export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, variant, children, markdown = false, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(accordionContentVariants({ variant }), className)}
    {...props}
  >
    <div className="px-6 pb-6 pt-2">
      {markdown && typeof children === 'string' ? (
        <MarkdownRenderer
          content={children}
          className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
        />
      ) : (
        children
      )}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

// ============================================================================
// HIGH-LEVEL COMPONENT (For simple usage with items array)
// ============================================================================

export interface AccordionItemData {
  title: string;
  subtitle?: string;
  content: string;
}

export interface AccordionProps extends VariantProps<typeof accordionRootVariants> {
  items: AccordionItemData[];
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Accordion - High-level component for simple array-based usage
 * Automatically renders markdown content with full HTML and LaTeX support
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { title: 'Title 1', content: '# Markdown with $x^2$ and <h3>HTML</h3>' },
 *     { title: 'Title 2', subtitle: 'Subtitle', content: 'More content' }
 *   ]}
 *   allowMultiple
 *   defaultOpenIndex={0}
 * />
 * ```
 */
export const Accordion = React.forwardRef<
  HTMLDivElement,
  AccordionProps
>(({ className, variant, items, defaultOpenIndex, allowMultiple = false }, ref) => {
  const defaultValue = defaultOpenIndex !== undefined ? `item-${defaultOpenIndex}` : undefined;

  return allowMultiple ? (
    <AccordionPrimitive.Root
      ref={ref}
      type="multiple"
      defaultValue={defaultValue ? [defaultValue] : undefined}
      className={cn(accordionRootVariants({ variant }), className)}
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={`item-${index}`}
          value={`item-${index}`}
          className={cn(accordionItemVariants({ variant }))}
        >
          <AccordionPrimitive.Trigger
            className={cn(accordionTriggerVariants({ variant }))}
          >
            <div className="flex-1 text-left">
              <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)] mb-1">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-[14px] text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                  {item.subtitle}
                </p>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-dark-600 dark:text-grey-400 transition-transform duration-200 shrink-0 ml-4" />
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content
            className={cn(accordionContentVariants({ variant }))}
          >
            <div className="px-6 pb-6 pt-2">
              <MarkdownRenderer
                content={item.content}
                className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
              />
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  ) : (
    <AccordionPrimitive.Root
      ref={ref}
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn(accordionRootVariants({ variant }), className)}
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={`item-${index}`}
          value={`item-${index}`}
          className={accordionItemVariants({ variant })}
        >
          <AccordionPrimitive.Trigger className={accordionTriggerVariants({ variant })}>
            <div className="flex-1 text-left">
              <h3 className="text-[18px] font-bold text-primary-green font-[family-name:var(--font-quicksand)] mb-1">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-[14px] text-dark-700 dark:text-white font-[family-name:var(--font-rubik)]">
                  {item.subtitle}
                </p>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-dark-600 dark:text-grey-400 transition-transform duration-200 shrink-0 ml-4" />
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content className={accordionContentVariants({ variant })}>
            <div className="px-6 pb-6 pt-2">
              <MarkdownRenderer
                content={item.content}
                className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]"
              />
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
});

Accordion.displayName = 'Accordion';
