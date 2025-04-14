'use client';

import { usePathname } from 'next/navigation';
import AnimatedNavButton from '@/components/AnimatedNavButton';

export default function Home() {
  const pathname = usePathname();

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="pt-10 sm:pt-16 lg:pt-20 xl:pt-28">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                  <span className="block">Transform Your</span>
                  <span className="block text-indigo-600 dark:text-indigo-400">Fitness Journey with Gym Sync</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Achieve your fitness goals with our state-of-the-art facilities, expert trainers, and personalized programs.
                </p>
                <div className="mt-6 flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-center lg:justify-start">
                  <AnimatedNavButton href="/signup" icon="🚀">
                    Get Started
                  </AnimatedNavButton>
                  <AnimatedNavButton href="/about" icon="📚">
                    Learn More
                  </AnimatedNavButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero image - full width on mobile */}
        <div className="mt-6 w-full bg-indigo-100 dark:bg-indigo-900 h-56 sm:h-72 md:h-96 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-10"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <span className="text-xl font-bold">Gym Image Placeholder</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-2xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Everything you need for your fitness journey
            </p>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-300 mx-auto">
              Our comprehensive facilities and services are designed to support you at every step.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">💪</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Modern Equipment</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Access to state-of-the-art fitness equipment designed to help you achieve your goals efficiently.
                </p>
              </div>
              <div className="relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expert Trainers</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Our certified personal trainers create customized workout plans tailored to your specific needs.
                </p>
              </div>
              <div className="relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🧘‍♀️</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Flexible Classes</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Join a variety of group fitness classes including yoga, spinning, HIIT, and more.
                </p>
              </div>
              <div className="relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">🥗</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nutrition Guidance</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Receive personalized nutrition advice to complement your fitness routine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
