import React from 'react';

function UrlResults({ results }) {
  if (!results.length) return null;
  return (
    <div className="url-results">
      <h3>Shortened URLs</h3>
      <ul>
        {results.map((item, idx) => (
          <li key={idx}>
            <strong>Original:</strong> {item.original} <br />
            <strong>Shortened:</strong> <a href={item.shortened} target="_blank" rel="noopener noreferrer">{item.shortened}</a> <br />
            <strong>Expires at:</strong> {item.expiry}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UrlResults; 