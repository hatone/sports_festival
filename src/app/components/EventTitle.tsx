import React from 'react';

interface EventTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function EventTitle({ title, subtitle, className = '' }: EventTitleProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-4xl md:text-6xl font-bold relative inline-block">
        <span className="relative z-10">{title}</span>
        <span className="absolute inset-0 bg-gray-100 -rotate-1 rounded -z-10 transform scale-105"></span>
      </h1>
      {subtitle && (
        <p className="text-xl md:text-2xl text-gray-700 font-medium mt-4 bg-white px-4 py-2 rounded inline-block">
          {subtitle}
        </p>
      )}
    </div>
  );
}