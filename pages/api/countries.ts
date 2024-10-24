import { NextApiRequest, NextApiResponse } from 'next';

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'MX', name: 'Mexico' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'BR', name: 'Brazil' },
  // Agrega más países aquí si lo deseas
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(countries);
}
