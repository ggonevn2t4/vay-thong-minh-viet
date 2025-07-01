
import React from 'react';

interface SearchResultHighlightProps {
  text: string;
  searchQuery: string;
  className?: string;
}

const SearchResultHighlight: React.FC<SearchResultHighlightProps> = ({
  text,
  searchQuery,
  className = ''
}) => {
  if (!searchQuery || !text) {
    return <span className={className}>{text}</span>;
  }

  // Create a regex to find all instances of the search query (case insensitive)
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default SearchResultHighlight;
