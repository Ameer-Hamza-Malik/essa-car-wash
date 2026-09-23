import mongoose from 'mongoose';

export default function handler(_request, response) {
  return response.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
}