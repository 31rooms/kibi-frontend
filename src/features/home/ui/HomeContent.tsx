'use client';

import React from 'react';
import Image from 'next/image';
import type { HomeContentProps } from '../types/home.types';

/**
 * Home Content Component
 * Main content area displaying selected section information
 */
export const HomeContent = React.forwardRef<HTMLElement, HomeContentProps>(
  ({ selectedSection }, ref) => {
    return (
      <main ref={ref} className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/illustrations/logo.svg"
                alt="Kibi Logo"
                width={120}
                height={120}
              />
            </div>
            <h1 className="text-[32px] md:text-[40px] font-bold text-dark-900 font-[family-name:var(--font-quicksand)] mb-4">
              Bienvenido a Kibi
            </h1>
            <p className="text-[16px] md:text-[18px] text-dark-600 font-[family-name:var(--font-rubik)] mb-2">
              Sección seleccionada:{' '}
              <span className="font-semibold text-primary-green">
                {selectedSection.replace('-', ' ').toUpperCase()}
              </span>
            </p>
            <p className="text-[14px] md:text-[16px] text-dark-500 font-[family-name:var(--font-rubik)]">
              El contenido de esta sección se implementará próximamente.
            </p>
          </div>
        </div>
      </main>
    );
  }
);

HomeContent.displayName = 'HomeContent';
