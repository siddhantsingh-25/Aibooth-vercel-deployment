"use client";
import React from 'react';
import AiBoothComponent from './components/AiBooth.client'

const Page: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">AiBooth</h1>
      <AiBoothComponent />
    </div>
  );
};

export default Page;
