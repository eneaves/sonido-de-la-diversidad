import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CountrySelector from '@/app/components/CountrySelector';

interface Song {
  item: {
    name: string;
    artists: { name: string; id: string }[];
    album: {
      images: { url: string }[];
    };
  };
}

interface Artist {
  images: { url: string }[];
  genres: string[];
  popularity: number;
  followers: { total: number };
}

interface PlayProps {
  access_token: string;
}

const Play = ({ access_token }: PlayProps) => {
  const [song, setSong] = useState<Song | null>(null);
  const [artistImage, setArtistImage] = useState<string | null>(null);
  const [artistDescription, setArtistDescription] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false); // Estado del botón de Like

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const songData = response.data;
        setSong(songData);

        if (songData && songData.item && songData.item.artists.length > 0) {
          const artistId = songData.item.artists[0].id;
          const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          const artistData: Artist = artistResponse.data;
          setArtistImage(artistData.images[0]?.url || null);
          setArtistDescription(`
            Géneros: ${artistData.genres.join(', ')}. 
            Popularidad: ${artistData.popularity}. 
            Seguidores: ${artistData.followers.total.toLocaleString()}.
          `);
        }
      } catch (error) {
        console.error('Error fetching currently playing song or artist:', error);
      }
    };

    fetchSong();
  }, [access_token]);

  const handleLike = async () => {
    setIsLiked(!isLiked); // Cambia el estado del botón de "Like"

    try {
      await axios.post('http://localhost:3001/api/like', { // Supón que tu backend está en localhost
        songName: song?.item.name,
        artistName: song?.item.artists[0].name,
        isLiked: !isLiked,
      });
      console.log('Like status sent to backend');
    } catch (error) {
      console.error('Error sending like status to backend:', error);
    }
  };

  const playSong = async () => {
    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error playing the song:', error);
    }
  };

  return (
    <div style={styles.container}>

      {song ? (
        <div style={styles.songArtistContainer}>
          {/* Portada del álbum */}
          <div style={styles.albumContainer}>
            <img
              src={song.item.album.images[0].url}
              alt="Album cover"
              style={styles.albumImage}
            />
            <h1 style={styles.songTitle}>{song.item.name}</h1>
            <button onClick={playSong} style={styles.playButton}>PLAY</button>

            {/* Botón de Like */}
            <button
              onClick={handleLike}
              style={{
                ...styles.likeButton,
                backgroundColor: isLiked ? '#ff4e50' : '#ccc', // Cambia el color si está "liked"
              }}
            >
              {isLiked ? 'Unlike' : 'Like'}
            </button>
          </div>

          {/* Imagen y descripción del artista */}
          <div style={styles.artistContainer}>
            {artistImage && (
              <img
                src={artistImage}
                alt="Artist"
                style={styles.artistImage}
              />
            )}
            {artistDescription && (
              <div style={styles.artistDescriptionContainer}>
                <h2 style={styles.artistName}>{song.item.artists[0].name}</h2>
                <p style={styles.artistDescription}>{artistDescription}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p style={styles.noSongText}>No song currently playing</p>
      )}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { access_token } = context.query;
  return { props: { access_token } };
}

// Estilos
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '0 10%',
    backgroundColor: '#3c1e04',
    background: 'linear-gradient(to right, #3c1e04, #b3571f)', // Fondo degradado
    color: '#fff',
    textAlign: 'center' as 'center',
    fontFamily: "'Play', sans-serif",
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px', // Añadimos margen inferior para separación
  },
  searchButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    marginLeft: '10px',
    background: 'linear-gradient(to right, #f9d423, #ff4e50)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s',
  },
  songArtistContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: '50px', // Controlamos el espacio entre las tarjetas con gap
  },
  albumContainer: {
    textAlign: 'center' as 'center',
  },
  albumImage: {
    width: '350px',
    height: '350px',
    borderRadius: '20px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
  },
  songTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginTop: '20px',
    marginBottom: '10px',
  },
  playButton: {
    padding: '15px 40px',
    fontSize: '1.5rem',
    background: 'linear-gradient(to right, #f9d423, #ff4e50)',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    marginTop: '20px',
    transition: 'transform 0.2s',
  },
  likeButton: {
    padding: '10px 20px',
    fontSize: '1.2rem',
    background: '#ccc',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s',
  },
  artistContainer: {
    textAlign: 'center' as 'center',
    maxWidth: '300px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '10px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
  },
  artistImage: {
    width: '100%',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  artistName: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  artistDescriptionContainer: {
    textAlign: 'left' as 'left',
    color: '#333',
    fontSize: '1.2rem',
  },
  artistDescription: {
    margin: '0',
    padding: '0',
  },
  noSongText: {
    fontSize: '1.5rem',
    color: '#fff',
  },
};

export default Play;
