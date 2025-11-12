'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';

// Custom rehype plugin to convert LaTeX delimiters in text nodes
// This plugin processes text nodes after HTML parsing to ensure LaTeX works correctly
// even when mixed with HTML elements
function rehypeConvertLatexDelimiters() {
  return (tree: any) => {
    visit(tree, 'text', (node) => {
      if (node.value) {
        // Convert LaTeX delimiters: \(...\) to $...$ and \[...\] to $$...$$
        node.value = node.value
          .replace(/\\\(/g, '$')
          .replace(/\\\)/g, '$')
          .replace(/\\\[/g, '$$')
          .replace(/\\\]/g, '$$');
      }
    });

    // Also process raw HTML text content
    visit(tree, 'raw', (node) => {
      if (node.value) {
        node.value = node.value
          .replace(/\\\(/g, '$')
          .replace(/\\\)/g, '$')
          .replace(/\\\[/g, '$$')
          .replace(/\\\]/g, '$$');
      }
    });
  };
}

export interface MarkdownRendererProps {
  /**
   * The markdown content to render
   */
  content: string;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * MarkdownRenderer Component
 *
 * A reusable markdown renderer with full LaTeX support, HTML support, and dark mode styling.
 * Supports GitHub Flavored Markdown (GFM), raw HTML, and math equations.
 *
 * Features:
 * - GitHub Flavored Markdown (tables, strikethrough, task lists, etc.)
 * - Raw HTML support (allows <h3>, <ol>, <li>, etc.)
 * - LaTeX math equations with multiple notations (automatically converted):
 *   - Inline: $...$ or \(...\)
 *   - Display: $$...$$ or \[...\]
 * - Full dark mode support
 * - Consistent typography using Kibi fonts
 * - Styled code blocks, links, headings, lists, etc.
 *
 * Implementation:
 * Uses a custom rehype plugin (rehypeConvertLatexDelimiters) to convert \(...\) to $...$
 * after HTML processing, ensuring LaTeX works correctly even when mixed with HTML.
 *
 * Plugin order:
 * 1. rehypeRaw - Parses raw HTML
 * 2. rehypeConvertLatexDelimiters - Converts \(...\) to $...$
 * 3. rehypeKatex - Renders LaTeX equations
 *
 * @example
 * ```tsx
 * // With dollar signs
 * <MarkdownRenderer content="# Title\n\nThis is **bold** text with $x^2$ math." />
 *
 * // With LaTeX delimiters (automatically converted)
 * <MarkdownRenderer content="Formula: \(P_k = \frac{k(n+1)}{4}\)" />
 *
 * // With HTML and LaTeX mixed
 * <MarkdownRenderer content="<h3>Title</h3><p>Formula: \(x^2\)</p>" />
 * ```
 */
export const MarkdownRenderer = React.forwardRef<HTMLDivElement, MarkdownRendererProps>(
  ({ content, className }, ref) => {
    // Preprocess content to ensure LaTeX formulas are properly detected
    // This handles cases where LaTeX is inside HTML tags
    const preprocessedContent = React.useMemo(() => {
      if (!content) return '';

      // Convert escaped LaTeX delimiters that might come from backend
      let processed = content
        .replace(/\\\\(\[|]|\(|\))/g, '\\$1') // Fix double-escaped delimiters
        .replace(/\\\(/g, '$')
        .replace(/\\\)/g, '$')
        .replace(/\\\[/g, '$$')
        .replace(/\\\]/g, '$$');

      return processed;
    }, [content]);

    return (
      <div ref={ref} className={className}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[
            rehypeRaw,
            rehypeConvertLatexDelimiters,
            [rehypeKatex, { output: 'htmlAndMathml' }],
          ]}
          components={{
            p: ({ children }) => (
              <p className="text-[14px] text-dark-800 dark:text-white leading-relaxed mb-3 last:mb-0">
                {children}
              </p>
            ),
            a: ({ href, children }) => {
              // Check if the href is an image URL
              const isImageUrl = href && /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i.test(href);

              if (isImageUrl) {
                // Render as image if it's an image URL
                return (
                  <img
                    src={href}
                    alt={typeof children === 'string' ? children : 'Image'}
                    className="rounded-lg max-w-full h-auto my-4"
                  />
                );
              }

              // Otherwise render as a normal link
              return (
                <a
                  href={href}
                  className="text-blue-500 underline hover:text-blue-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              );
            },
            strong: ({ children }) => (
              <strong className="font-bold text-dark-900 dark:text-white">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-dark-800 dark:text-white">{children}</em>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-[14px] text-dark-800 dark:text-white">{children}</li>
            ),
            h1: ({ children }) => (
              <h1 className="text-[20px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-3">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-[18px] font-bold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-[16px] font-semibold text-dark-900 dark:text-white font-[family-name:var(--font-quicksand)] mb-2">
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
              <code className="bg-grey-100 dark:bg-[#272E3A] px-2 py-1 rounded text-[13px] font-mono text-dark-900 dark:text-white">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-grey-100 dark:bg-[#272E3A] p-4 rounded-lg overflow-x-auto mb-3">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary-green pl-4 italic text-dark-700 dark:text-white my-3">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="border-grey-300 dark:border-[#374151] my-4" />,
          }}
        >
          {preprocessedContent}
        </ReactMarkdown>
      </div>
    );
  }
);

MarkdownRenderer.displayName = 'MarkdownRenderer';
