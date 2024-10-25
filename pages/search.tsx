import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import CountrySelector from "../app/components/CountrySelector"; 

interface Song {
  name: string;
  uri: string; 
  artists: { name: string; id: string }[];
  album: {
    images: { url: string }[];
  };
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  popularity: number;
  followers: { total: number };
}

const SearchSong = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [artistImage, setArtistImage] = useState<string | null>(null);
  const [artistDescription, setArtistDescription] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { access_token, refresh_token } = router.query;

      if (typeof access_token === "string") {
        setAccessToken(access_token);
        console.log("Access Token:", access_token);
      }

      if (typeof refresh_token === "string") {
        setRefreshToken(refresh_token);
        console.log("Refresh Token:", refresh_token);
      }
    }
  }, [router.isReady, router.query]);

  // Función para buscar un artista del país seleccionado y reproducir una canción aleatoria
  const handleSearch = async () => {
    if (!selectedCountry || !accessToken) {
      console.error("No hay país seleccionado o el access token está vacío.");
      return;
    }
  
    let genreSeeds: string[] = [];

      // Lista de géneros soportados por la API de Spotify
  const supportedGenres = [
    "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova",
    "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country",
    "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm",
    "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", 
    "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house",
    "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids",
    "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", 
    "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", 
    "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", 
    "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", 
    "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", 
    "trance", "trip-hop", "turkish", "work-out", "world-music"
  ];
  
    // Definir algunos géneros representativos para países específicos
    switch (selectedCountry) {
      case 'US':
        genreSeeds = ['hip-hop', 'country', 'rock', 'pop', 'r&b'];
        break;
      case 'MX':
        genreSeeds = ['ranchera', 'norteño', 'banda', 'mariachi'];
        break;
      case 'GB':
        genreSeeds = ['british rock', 'pop', 'electronic', 'grime', 'indie'];
        break;
      case 'FR':
        genreSeeds = ['french pop', 'chanson', 'electro', 'hip-hop francais', 'french indie'];
        break;
      case 'BR':
        genreSeeds = ['samba', 'bossa nova', 'sertanejo', 'funk carioca', 'tropicalia'];
        break;
      case 'KR':
        genreSeeds = ['k-pop', 'k-hip-hop', 'k-rock', 'k-r&b', 'trot'];
        break;
      case 'JP':
        genreSeeds = ['j-pop', 'enka', 'j-rock', 'anime', 'city pop'];
        break;
      case 'IN':
        genreSeeds = ['bhangra', 'indian classical', 'indian pop', 'punjabi'];
        break;
      case 'NG':
        genreSeeds = ['afrobeat', 'afropop', 'highlife', 'naija hip hop', 'fuji'];
        break;
      case 'GH':
        genreSeeds = ['hiplife', 'azonto', 'afrobeat', 'highlife', 'gospel ghana'];
        break;
      case 'ZA':
        genreSeeds = ['afrohouse', 'kwaito', 'gqom', 'mbube', 'maskandi'];
        break;
      case 'SE':
        genreSeeds = ['swedish pop', 'swedish hip hop', 'electropop', 'folk', 'metal'];
        break;
      case 'DE':
        genreSeeds = ['german pop', 'schlager', 'techno', 'krautrock', 'german hip hop'];
        break;
      case 'IT':
        genreSeeds = ['italian pop', 'italo disco', 'classical', 'cantautori', 'opera'];
        break;
      case 'RU':
        genreSeeds = ['russian pop', 'russian hip hop', 'russian rock', 'folk', 'russian classical'];
        break;
      case 'CN':
        genreSeeds = ['c-pop', 'mandopop', 'cantopop', 'chinese hip hop', 'folk chinese'];
        break;
      case 'TR':
        genreSeeds = ['turkish pop', 'arabesk', 'anatolian rock', 'turkish classical', 'turkish folk'];
        break;
      case 'AU':
        genreSeeds = ['australian indie', 'australian hip hop', 'folk', 'pop', 'rock'];
        break;
      case 'CA':
        genreSeeds = ['canadian pop', 'indie', 'folk', 'hip-hop', 'country'];
        break;
      case 'EG':
        genreSeeds = ['egyptian pop', 'shaabi', 'arabic classical', 'mahraganat', 'arabic hip hop'];
        break;
      default:
        genreSeeds = ['pop'];
        break;
    }
  
  // Validar los géneros para que solo se envíen géneros soportados
  genreSeeds = genreSeeds.filter(genre => supportedGenres.includes(genre));

  if (genreSeeds.length === 0) {
    console.warn("No hay géneros válidos para este país, utilizando géneros globales.");
    genreSeeds = ['pop', 'rock', 'hip-hop']; // Géneros globales por defecto
  }

  try {
    // Usar el endpoint de recomendaciones con los géneros del país
    const recommendationsResponse = await axios.get(
      `https://api.spotify.com/v1/recommendations?market=${selectedCountry}&seed_genres=${genreSeeds.join(',')}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const tracks = recommendationsResponse.data.tracks;

    if (tracks.length === 0) {
      console.error("No se encontraron recomendaciones para el país seleccionado.");
      return;
    }
  
      // Selecciona una canción aleatoria de la lista recomendada
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
  
      // Actualiza la información de la canción
      setSong(randomTrack);
  
      // Actualiza la información del artista y la descripción
      const artist = randomTrack.artists[0];
      const artistResponse = await axios.get(
        `https://api.spotify.com/v1/artists/${artist.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const artistData = artistResponse.data;
      setArtistImage(artistData.images[0]?.url || null);
      setArtistDescription(`
        Géneros: ${artistData.genres.join(", ")}. 
        Popularidad: ${artistData.popularity}. 
        Seguidores: ${artistData.followers.total.toLocaleString()}.
      `);
    } catch (error) {
      console.error("Error fetching recommendations or artist data:", error);
    }
  };
  

  // Función para reproducir la canción
  const playSong = async () => {
    if (!song || !accessToken) return;

    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/play",
        {
          uris: [song.uri],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Playing song:", song.name);
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  // Función para manejar el Like
  const handleLike = async () => {
    setIsLiked(!isLiked); // Cambia el estado de "Like"
    try {
      await axios.post("http://localhost:3001/api/like", {
        songName: song?.name,
        artistName: song?.artists[0].name,
        isLiked: !isLiked,
      });
      console.log("Like status sent to backend");
    } catch (error) {
      console.error("Error sending like status to backend:", error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Buscar Canción por País en Spotify</h1>
        <CountrySelector onCountrySelect={(countryCode) => setSelectedCountry(countryCode)} />
        <button onClick={handleSearch} style={styles.searchButton}>
          Buscar
        </button>
      </header>

      {song ? (
        <div style={styles.songArtistContainer}>
          <div style={styles.albumContainer}>
            <img
              src={song.album.images[0].url}
              alt="Album cover"
              style={styles.albumImage}
            />
            <h1 style={styles.songTitle}>{song.name}</h1>

            {/* Botón de Play */}
            <button onClick={playSong} style={styles.playButton}>
              PLAY
            </button>

            {/* Botón de Like */}
            <button
              onClick={handleLike}
              style={{
                ...styles.likeButton,
                backgroundColor: isLiked ? "#ff4e50" : "#ccc", // Cambia el color si está "liked"
              }}
            >
              {isLiked ? "Unlike" : "Like"}
            </button>
          </div>

          <div style={styles.artistContainer}>
            {artistImage && (
              <img src={artistImage} alt="Artist" style={styles.artistImage} />
            )}
            {artistDescription && (
              <div style={styles.artistDescriptionContainer}>
                <h2 style={styles.artistName}>{song.artists[0].name}</h2>
                <p style={styles.artistDescription}>{artistDescription}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p style={styles.noSongText}>No hay canciones disponibles</p>
      )}
    </div>
  );
};

// Estilos
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    backgroundColor: "#3c1e04",
    background: "linear-gradient(to right, #3c1e04, #b3571f)",
    color: "#fff",
    textAlign: "center" as "center",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  searchButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    background: "linear-gradient(to right, #f9d423, #ff4e50)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
  songArtistContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "50px",
  },
  albumContainer: {
    textAlign: "center" as "center",
  },
  albumImage: {
    width: "350px",
    height: "350px",
    borderRadius: "20px",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
  },
  songTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "20px",
  },
  playButton: {
    padding: "15px 40px",
    fontSize: "1.5rem",
    background: "linear-gradient(to right, #f9d423, #ff4e50)",
    border: "none",
    borderRadius: "50px",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
  },
  likeButton: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    background: "#ccc",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "15px",
    transition: "background-color 0.3s",
  },
  artistContainer: {
    textAlign: "center" as "center",
    maxWidth: "300px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
  },
  artistImage: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  artistName: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  },
  artistDescriptionContainer: {
    textAlign: "left" as "left",
    color: "#333",
  },
  artistDescription: {
    margin: 0,
  },
  noSongText: {
    fontSize: "1.5rem",
    color: "#fff",
  },
};

export default SearchSong;
