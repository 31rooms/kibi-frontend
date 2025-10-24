'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const accordionVariants = cva(
  'w-full rounded-lg border border-grey-300 bg-white overflow-hidden',
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

const accordionItemVariants = cva(
  'border-b border-grey-300 last:border-0',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'border-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const accordionTriggerVariants = cva(
  'flex w-full items-center justify-between py-4 px-6 text-left transition-all hover:bg-grey-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
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

export interface AccordionItemData {
  title: string;
  subtitle?: string;
  content: string;
}

export interface AccordionProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>, 'type' | 'value' | 'defaultValue'>,
    VariantProps<typeof accordionVariants> {
  items: AccordionItemData[];
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
}

export const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant, items, defaultOpenIndex, allowMultiple = false }, ref) => {
  const defaultValue = defaultOpenIndex !== undefined ? `item-${defaultOpenIndex}` : undefined;

  return allowMultiple ? (
    <AccordionPrimitive.Root
      ref={ref}
      type="multiple"
      defaultValue={defaultValue ? [defaultValue] : undefined}
      className={cn(accordionVariants({ variant }), className)}
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
                <p className="text-[14px] text-dark-700 font-[family-name:var(--font-rubik)]">
                  {item.subtitle}
                </p>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content
            className={cn(accordionContentVariants({ variant }))}
          >
            <div className="px-6 pb-6 pt-2">
              <div className="text-[16px] text-dark-800 font-[family-name:var(--font-rubik)] leading-relaxed prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.content}
                </ReactMarkdown>
              </div>
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
      className={cn(accordionVariants({ variant }), className)}
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
                <p className="text-[14px] text-dark-700 font-[family-name:var(--font-rubik)]">
                  {item.subtitle}
                </p>
              )}
            </div>
            <ChevronDown className="h-5 w-5 text-dark-600 transition-transform duration-200 shrink-0 ml-4" />
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content className={accordionContentVariants({ variant })}>
            <div className="px-6 pb-6 pt-2">
              <div className="prose prose-sm max-w-none font-[family-name:var(--font-rubik)]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                  p: ({ children }) => (
                    <p className="text-[14px] text-dark-800 leading-relaxed mb-3 last:mb-0">
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-500 underline hover:text-blue-600 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-dark-900">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-dark-800">{children}</em>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[14px] text-dark-800">{children}</li>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-[20px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-[18px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-[16px] font-semibold text-dark-900 font-[family-name:var(--font-quicksand)] mb-2">
                      {children}
                    </h3>
                  ),
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt}
                      className="rounded-lg max-w-full h-auto my-4"
                    />
                  ),
                  code: ({ children }) => (
                    <code className="bg-grey-100 px-2 py-1 rounded text-[13px] font-mono text-dark-900">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-grey-100 p-4 rounded-lg overflow-x-auto mb-3">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary-green pl-4 italic text-dark-700 my-3">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="border-grey-300 my-4" />,
                }}
              >
                {item.content}
              </ReactMarkdown>
              </div>
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
});

Accordion.displayName = 'Accordion';
