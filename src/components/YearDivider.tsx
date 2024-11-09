import React from 'react';

interface YearDividerProps {
  year: number;
}

export function YearDivider({ year }: YearDividerProps) {
  return (
    <div className="relative my-16">
      <div className="absolute -left-4 -top-8 text-8xl font-bold text-white/10 select-none">
        {year}
      </div>
    </div>
  );
}