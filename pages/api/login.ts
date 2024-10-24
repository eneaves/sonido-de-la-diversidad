import { NextApiRequest, NextApiResponse } from 'next';

const client_id = process.env.SPOTIFY_CLIENT_ID as string;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  res.redirect(url);
}
