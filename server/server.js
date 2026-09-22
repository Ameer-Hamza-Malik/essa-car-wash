import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    service: { type: String, required: true, trim: true, maxlength: 80 },
    status: { type: String, enum: ['requested', 'confirmed', 'cancelled'], default: 'requested' },
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', bookingSchema);

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.post('/api/bookings', async (request, response) => {
  try {
    const { name, phone, service } = request.body;
    if (!name || !phone || !service) {
      return response.status(400).json({ message: 'Name, phone, and service are required.' });
    }

    const booking = await Booking.create({ name, phone, service });
    return response.status(201).json({ id: booking._id, message: 'Booking request received.' });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return response.status(500).json({ message: 'Unable to save booking right now.' });
  }
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Add it to .env before starting the server.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`ESSA API listening on http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
