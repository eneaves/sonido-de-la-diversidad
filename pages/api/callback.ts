import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string | null;

  if (!code) {
    res.status(400).json({ error: 'Missing code parameter' });
    return;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI as string);

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    // Redirige a la pantalla de reproducción pasando ambos tokens en la URL
    res.redirect(`/play?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
