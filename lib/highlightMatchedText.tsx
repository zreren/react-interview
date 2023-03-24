import React from 'react';

export function highlightMatchedText(text: string, query: string) {
  if (!query) {
    return text;
  }

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-300">
            {part}
          </mark>
        ) : (
          <span className='ml-1 font-bold truncate' key={index}>{part}</span>
        ),
      )}
    </>
  );
}
