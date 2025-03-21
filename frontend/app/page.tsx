'use client';
import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Project Planner</h1>
        <p className="text-xl">Welcome to your project management tool!</p>
        <div className="mt-8">
          <p className="text-lg">This is the main page of your application.</p>
          <p className="text-lg mt-4">Start managing your projects and levels!</p>
        </div>
      </div>
    </main>
  );
} 