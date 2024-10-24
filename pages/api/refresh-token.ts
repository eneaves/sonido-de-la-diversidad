// pages/api/refresh-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const refreshToken = req.query.refresh_token as string | null;

  if (!refreshToken) {
    res.status(400).json({ error: 'Missing refresh_token parameter' });
    return;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

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

    // Devuelve el nuevo access_token y refresh_token (si se proporciona uno nuevo)
    res.status(200).json({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token || refreshToken,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
}
