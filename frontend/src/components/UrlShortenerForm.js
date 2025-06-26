import React, { useState } from 'react';
import { logEvent } from '../middleware/logger';

const defaultUrlEntry = { url: '', validity: '', shortcode: '' };

function UrlShortenerForm({ onResults }) {
  const [urls, setUrls] = useState([{ ...defaultUrlEntry }]);
  const [errors, setErrors] = useState([]);
  const [formError, setFormError] = useState('');

  const handleChange = (idx, field, value) => {
    const newUrls = [...urls];
    newUrls[idx][field] = value;
    setUrls(newUrls);
  };

  const handleAdd = () => {
    if (urls.length < 5) setUrls([...urls, { ...defaultUrlEntry }]);
  };

  const handleRemove = (idx) => {
    if (urls.length > 1) setUrls(urls.filter((_, i) => i !== idx));
  };

  function isValidUrl(url) {
    try { new URL(url); return true; } catch { return false; }
  }

  const validate = () => {
    const errs = urls.map((entry) => {
      const entryErr = {};
      if (!isValidUrl(entry.url)) entryErr.url = 'Invalid URL';
      if (entry.validity && (!/^[0-9]+$/.test(entry.validity) || parseInt(entry.validity) <= 0)) {
        entryErr.validity = 'Enter a positive integer';
      }
      if (entry.shortcode && !/^[a-zA-Z0-9_-]+$/.test(entry.shortcode)) {
        entryErr.shortcode = 'Shortcode must be alphanumeric, dash or underscore';
      }
      return entryErr;
    });
    setErrors(errs);
    return errs.every((e) => Object.keys(e).length === 0);
  };

  // Simulate short link uniqueness and collision
  const usedShortcodes = new Set();

  const generateShortUrl = (original, shortcode) => {
    let code = shortcode || Math.random().toString(36).substring(2, 7);
    // Ensure uniqueness
    while (usedShortcodes.has(code)) {
      code = Math.random().toString(36).substring(2, 7);
    }
    usedShortcodes.add(code);
    return `http://localhost:3000/${code}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) {
      setFormError('Please fix the errors above.');
      logEvent('FORM_VALIDATION_FAILED', { urls });
      return;
    }
    // Simulate API and results
    const now = new Date();
    const results = urls.map((entry) => {
      const validity = entry.validity ? parseInt(entry.validity) : 30;
      const expiry = new Date(now.getTime() + validity * 60000).toLocaleString();
      const shortened = generateShortUrl(entry.url, entry.shortcode);
      return {
        original: entry.url,
        shortened,
        expiry,
      };
    });
    logEvent('URLS_SHORTENED', { results });
    onResults(results);
  };

  return (
    <form className="url-shortener-form" onSubmit={handleSubmit}>
      <h2>URL Shortener</h2>
      {formError && <div style={{ color: 'red', marginBottom: 8 }}>{formError}</div>}
      {urls.map((entry, idx) => (
        <div className="url-input-row" key={idx}>
          <input
            type="text"
            placeholder="Original URL"
            value={entry.url}
            onChange={e => handleChange(idx, 'url', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Validity (min, default 30)"
            value={entry.validity}
            onChange={e => handleChange(idx, 'validity', e.target.value)}
            min="1"
          />
          <input
            type="text"
            placeholder="Shortcode"
            value={entry.shortcode}
            onChange={e => handleChange(idx, 'shortcode', e.target.value)}
          />
          {urls.length > 1 && (
            <button type="button" onClick={() => handleRemove(idx)}>-</button>
          )}
          {errors[idx] && (
            <span style={{ color: 'red', fontSize: '0.8em' }}>
              {Object.values(errors[idx]).join(', ')}
            </span>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAdd} disabled={urls.length >= 5}>Add URL</button>
      <button type="submit">Shorten URLs</button>
    </form>
  );
}

export default UrlShortenerForm; 