export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const basePath = process.env.PROXY_BASE_URL;

    if (!basePath) {
      return res.status(500).json({
        error: 'PROXY_BASE_URL environment variable is not configured'
      });
    }

    // Формируем полный URL: базовый путь + динамический путь
    const fullPath = path ? path.join('/') : '';
    const targetUrl = fullPath ? `${basePath}/${fullPath}` : basePath;

    console.log(`Proxying request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'XML-Proxy/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch from target endpoint: ${response.statusText}`
      });
    }

    const data = await response.text();

    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/html');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).send(data);

  } catch (error) {
    console.error('Proxy endpoint error:', error);
    res.status(500).json({
      error: 'Failed to proxy request'
    });
  }
}