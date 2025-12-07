import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>XML Proxy Service</title>
        <meta name="description" content="XML endpoint proxy service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ marginBottom: '2rem', color: '#333' }}>
          XML Proxy Service
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <Link 
            href="/api/live" 
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              transition: 'background-color 0.3s'
            }}
          >
            Live Data
          </Link>
          
          <Link 
            href="/api/upcoming" 
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              transition: 'background-color 0.3s'
            }}
          >
            Upcoming Data
          </Link>
        </div>

        <p style={{ marginTop: '2rem', color: '#666' }}>
          Click the links above to access the XML endpoints
        </p>
      </main>
    </div>
  );
}