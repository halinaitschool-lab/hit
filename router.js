/**
 * Language Router
 * Automatically redirects users based on browser language
 * Supports: Ukrainian (uk), Polish (pl), English (en)
 * Default: Ukrainian (uk)
 */

(function() {
  // Get browser language
  const browserLang = navigator.language.split('-')[0];
  
  // Map of supported languages
  const supportedLangs = {
    'uk': 'ua',
    'pl': 'pl',
    'en': 'en'
  };

  // Determine target language
  let targetLang = 'ua'; // default
  
  if (supportedLangs[browserLang]) {
    targetLang = supportedLangs[browserLang];
  }

  // Get current location
  const currentPath = window.location.pathname;
  
  // Check if already on a language-specific page
  const langMatch = currentPath.match(/\/(ua|pl|en)\//);
  
  if (!langMatch) {
    // Not on a language page, redirect
    const newPath = `/${targetLang}${currentPath === '/' ? '/index.html' : currentPath}`;
    window.location.href = newPath;
  }
})();
