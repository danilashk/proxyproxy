import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [proxyUrl, setProxyUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProxyUrl('');
    setLoading(true);

    try {
      const response = await fetch('/api/create-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create proxy link');
      }

      setProxyUrl(data.proxyUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(proxyUrl);
    alert('Ссылка скопирована!');
  };

  return (
    <div>
      <Head>
        <title>Proxy Service</title>
        <meta name="description" content="URL proxy service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{
          marginBottom: '2rem',
          color: '#333',
          textAlign: 'center'
        }}>
          Proxy Service
        </h1>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#555',
                fontWeight: 'bold'
              }}>
                Введите URL для проксирования:
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.sports.ru/special/3x3/game-with-friend?roomId=..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0070f3'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: loading ? '#ccc' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0051cc')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#0070f3')}
            >
              {loading ? 'Создание...' : 'Создать прокси-ссылку'}
            </button>
          </form>

          {error && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          {proxyUrl && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#e8f5e9',
              border: '2px solid #4caf50',
              borderRadius: '8px'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2e7d32' }}>
                Прокси-ссылка создана!
              </h3>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={proxyUrl}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    fontSize: '1rem',
                    border: '1px solid #4caf50',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Копировать
                </button>
              </div>
              <p style={{
                marginTop: '1rem',
                fontSize: '0.9rem',
                color: '#555'
              }}>
                Используйте эту ссылку для доступа к контенту через прокси
              </p>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>Как это работает?</h3>
          <ul style={{ color: '#856404', lineHeight: '1.6' }}>
            <li>Вставьте полный URL (например, с sports.ru)</li>
            <li>Получите короткую прокси-ссылку</li>
            <li>При переходе по ней контент будет показан через ваш домен</li>
            <li>Все ресурсы (CSS, JS, изображения) тоже проксируются</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
