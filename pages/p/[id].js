export default function ProxyPage() {
  return null;
}

export async function getServerSideProps({ params, req, res }) {
  const { id } = params;

  try {
    // Декодируем URL из base64
    const base64Url = id
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Добавляем padding если нужно
    const padding = '='.repeat((4 - base64Url.length % 4) % 4);
    const originalUrl = Buffer.from(base64Url + padding, 'base64').toString('utf-8');

    // Валидация URL
    try {
      new URL(originalUrl);
    } catch (e) {
      return { notFound: true };
    }

    console.log(`Proxying to: ${originalUrl}`);

    // Получаем контент с оригинального URL
    const response = await fetch(originalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'text/html';
    let content = await response.text();

    // Если это HTML, переписываем ссылки
    if (contentType.includes('text/html')) {
      content = rewriteHtml(content, originalUrl, req);
    }

    // Устанавливаем заголовки ответа
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    // Отправляем контент напрямую
    res.write(content);
    res.end();

    return {
      props: {}
    };

  } catch (error) {
    console.error('Proxy error:', error);
    return {
      notFound: true
    };
  }
}

function rewriteHtml(html, originalUrl, req) {
  const parsedUrl = new URL(originalUrl);
  const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const proxyBase = `${protocol}://${host}/api/proxy`;

  // Переписываем абсолютные ссылки
  html = html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (match, url) => {
      if (url.startsWith(baseUrl)) {
        const encoded = encodeURIComponent(url);
        return `href="${proxyBase}?url=${encoded}"`;
      }
      return match;
    }
  );

  // Переписываем src для ресурсов (изображения, скрипты, стили)
  html = html.replace(
    /src="(https?:\/\/[^"]+)"/g,
    (match, url) => {
      const encoded = encodeURIComponent(url);
      return `src="${proxyBase}?url=${encoded}"`;
    }
  );

  // Переписываем относительные ссылки
  html = html.replace(
    /href="(\/[^"]+)"/g,
    (match, path) => {
      const fullUrl = baseUrl + path;
      const encoded = encodeURIComponent(fullUrl);
      return `href="${proxyBase}?url=${encoded}"`;
    }
  );

  html = html.replace(
    /src="(\/[^"]+)"/g,
    (match, path) => {
      const fullUrl = baseUrl + path;
      const encoded = encodeURIComponent(fullUrl);
      return `src="${proxyBase}?url=${encoded}"`;
    }
  );

  // Переписываем CSS url()
  html = html.replace(
    /url\((["']?)(https?:\/\/[^)"']+)\1\)/g,
    (match, quote, url) => {
      const encoded = encodeURIComponent(url);
      return `url(${quote}${proxyBase}?url=${encoded}${quote})`;
    }
  );

  // Переписываем относительные url() в CSS
  html = html.replace(
    /url\((["']?)(\/[^)"']+)\1\)/g,
    (match, quote, path) => {
      const fullUrl = baseUrl + path;
      const encoded = encodeURIComponent(fullUrl);
      return `url(${quote}${proxyBase}?url=${encoded}${quote})`;
    }
  );

  return html;
}