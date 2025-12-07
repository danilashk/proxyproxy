export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Декодируем URL
    const targetUrl = decodeURIComponent(url);

    console.log(`Proxying resource: ${targetUrl}`);

    // Получаем ресурс
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': new URL(targetUrl).origin,
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch resource: ${response.status}`);
      return res.status(response.status).send('Failed to fetch resource');
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    // Устанавливаем заголовки
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Если это CSS, переписываем url() внутри
    if (contentType && contentType.includes('text/css')) {
      let css = Buffer.from(buffer).toString('utf-8');
      const baseUrl = new URL(targetUrl).origin;

      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers.host;
      const proxyBase = `${protocol}://${host}/api/proxy`;

      // Переписываем абсолютные URL в CSS
      css = css.replace(
        /url\((["']?)(https?:\/\/[^)"']+)\1\)/g,
        (match, quote, url) => {
          const encoded = encodeURIComponent(url);
          return `url(${quote}${proxyBase}?url=${encoded}${quote})`;
        }
      );

      // Переписываем относительные URL в CSS
      css = css.replace(
        /url\((["']?)(\/[^)"']+)\1\)/g,
        (match, quote, path) => {
          const fullUrl = baseUrl + path;
          const encoded = encodeURIComponent(fullUrl);
          return `url(${quote}${proxyBase}?url=${encoded}${quote})`;
        }
      );

      // Переписываем относительные пути без /
      css = css.replace(
        /url\((["']?)([^"'/:][^)"']*)\1\)/g,
        (match, quote, path) => {
          const urlDir = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
          const fullUrl = urlDir + path;
          const encoded = encodeURIComponent(fullUrl);
          return `url(${quote}${proxyBase}?url=${encoded}${quote})`;
        }
      );

      res.send(css);
    } else {
      // Для остальных типов файлов отправляем как есть
      res.send(Buffer.from(buffer));
    }

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy error');
  }
}