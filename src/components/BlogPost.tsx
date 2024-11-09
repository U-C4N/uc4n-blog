import React from 'react';

interface BlogPostProps {
  title: string;
  date: string;
  readingTime: number;
  isExternal?: boolean;
  titleCn?: string;
  href: string;
}

export function BlogPost({ title, date, readingTime, isExternal, titleCn, href }: BlogPostProps) {
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block py-3"
    >
      <article className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-gray-400 group-hover:text-white transition-colors">
            {title} {isExternal && "↗"}
          </h3>
          {titleCn && (
            <h3 className="text-gray-400 group-hover:text-white transition-colors">
              {titleCn}
            </h3>
          )}
        </div>
        <div className="text-gray-600 text-sm whitespace-nowrap">
          {date} · {readingTime}min
        </div>
      </article>
    </a>
  );
}