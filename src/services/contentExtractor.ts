export async function extractFromUrl(url: string): Promise<{ title: string; text: string }> {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const html = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) }).then(r => r.text());

  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Remove non-content elements
  const removeSelectors = ['script', 'style', 'nav', 'footer', 'header', 'aside', '.ad', '.sidebar', '.advertisement', '.social-share', 'iframe', 'noscript'];
  removeSelectors.forEach(sel => doc.querySelectorAll(sel).forEach(el => el.remove()));

  const title = doc.querySelector('title')?.textContent?.trim() || 'Untitled';
  const article = doc.querySelector('article') || doc.querySelector('main') || doc.body;
  const text = article?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 5000) || '';

  if (text.length < 50) {
    throw new Error('Could not extract enough content from this URL. Try pasting the text directly.');
  }

  return { title, text };
}

export function processDirectText(text: string): { title: string; text: string } {
  const firstLine = text.split('\n')[0].slice(0, 100);
  return { title: firstLine, text: text.slice(0, 5000) };
}
