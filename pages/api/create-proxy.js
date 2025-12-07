import { getStorage } from '../../lib/storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Валидация URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const storage = getStorage();
    const id = storage.createLink(url);

    // Формируем полный URL прокси
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const proxyUrl = `${protocol}://${host}/p/${id}`;

    res.status(200).json({
      success: true,
      proxyUrl,
      id,
      originalUrl: url
    });

  } catch (error) {
    console.error('Create proxy error:', error);
    res.status(500).json({
      error: 'Failed to create proxy link'
    });
  }
}