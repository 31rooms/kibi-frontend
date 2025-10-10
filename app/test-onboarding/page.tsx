'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function TestOnboardingPage() {
  const handleResetOnboarding = () => {
    localStorage.removeItem('kibi_onboarding_completed');
    alert('Onboarding reset! Refresh the page or go to "/" to see the splash screen again.');
  };

  return (
    <div className="min-h-screen bg-grey-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text-dark)] mb-2">
            Onboarding Flow - Test Page
          </h1>
          <p className="text-[var(--color-text-medium)]">
            Test the complete onboarding experience
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-4">
              Navigation Flow
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-grey-50 rounded-lg">
                <p className="font-medium text-[var(--color-text-dark)] mb-2">
                  1. Splash Screen (/)
                </p>
                <p className="text-sm text-[var(--color-text-medium)] mb-3">
                  Shows the Kibi logo and loading animation for 2 seconds, then redirects to onboarding
                </p>
                <Link href="/">
                  <Button variant="secondary" color="blue" size="small">
                    Go to Splash
                  </Button>
                </Link>
              </div>

              <div className="p-4 bg-grey-50 rounded-lg">
                <p className="font-medium text-[var(--color-text-dark)] mb-2">
                  2. Onboarding (/onboarding)
                </p>
                <p className="text-sm text-[var(--color-text-medium)] mb-3">
                  Interactive carousel with 4 slides. Use swipe, arrow keys, or the circular button to navigate.
                </p>
                <Link href="/onboarding">
                  <Button variant="secondary" color="blue" size="small">
                    Go to Onboarding
                  </Button>
                </Link>
              </div>

              <div className="p-4 bg-grey-50 rounded-lg">
                <p className="font-medium text-[var(--color-text-dark)] mb-2">
                  3. Auth Pages
                </p>
                <p className="text-sm text-[var(--color-text-medium)] mb-3">
                  Login and Register pages (placeholders for now)
                </p>
                <div className="flex gap-2">
                  <Link href="/auth/login">
                    <Button variant="secondary" color="blue" size="small">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="secondary" color="blue" size="small">
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-grey-300">
            <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-4">
              Features
            </h2>
            <ul className="space-y-2 text-[var(--color-text-medium)]">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Touch/swipe navigation on mobile devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Keyboard navigation (Arrow Left/Right)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Circular navigation button with green accent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Page indicators (clickable to jump to slides)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Smooth transitions between slides</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Final slide with Register and Login buttons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>localStorage persistence (completed state)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Responsive design (mobile-first)</span>
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-grey-300">
            <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-4">
              Components Created
            </h2>
            <ul className="space-y-2 text-[var(--color-text-medium)]">
              <li><code className="bg-grey-100 px-2 py-1 rounded">PageIndicator</code> - Animated page dots</li>
              <li><code className="bg-grey-100 px-2 py-1 rounded">OnboardingSheet</code> - Bottom content panel</li>
              <li><code className="bg-grey-100 px-2 py-1 rounded">OnboardingSlide</code> - Slide container with illustration</li>
              <li><code className="bg-grey-100 px-2 py-1 rounded">CircleButton</code> - Circular navigation button</li>
            </ul>
          </section>

          <section className="pt-6 border-t border-grey-300">
            <h2 className="text-xl font-bold text-[var(--color-text-dark)] mb-4">
              Reset Onboarding
            </h2>
            <p className="text-sm text-[var(--color-text-medium)] mb-4">
              Click this button to clear the onboarding completion flag from localStorage.
              This allows you to test the splash screen flow again.
            </p>
            <Button
              variant="primary"
              color="green"
              size="medium"
              onClick={handleResetOnboarding}
            >
              Reset Onboarding State
            </Button>
          </section>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Development Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Illustrations are using emoji placeholders - replace with actual assets</li>
            <li>• Auth pages are placeholders - implement full authentication flow</li>
            <li>• Consider adding Framer Motion for more advanced animations</li>
            <li>• The onboarding completion state persists in localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
