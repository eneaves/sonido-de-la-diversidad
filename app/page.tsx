import Link from 'next/link';
import { CSSProperties } from 'react';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sonidos de la Diversidad</h1>
      <Link href="/api/login">
        <button style={styles.loginButton}>Login with Spotify</button>
      </Link>
    </div>
  );
};

// Estilos para la página principal con colores anaranjados
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to right, #3c1e04, #b3571f)', // Degradado anaranjado
    color: '#fff',
    textAlign: 'center' as 'center',
  },
  title: {
    fontSize: '4rem',
    fontFamily: "'Play', sans-serif", // Fuente "Play" para el título
    marginBottom: '20px',
  },
  loginButton: {
    padding: '15px 40px',
    fontSize: '1.5rem',
    background: 'linear-gradient(to right, #f9d423, #ff4e50)', // Color anaranjado para el botón
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Sombra para darle profundidad
  },
};

export default HomePage;
