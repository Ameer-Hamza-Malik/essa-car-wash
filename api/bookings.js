import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    service: { type: String, required: true, trim: true, maxlength: 80 },
    status: { type: String, enum: ['requested', 'confirmed', 'cancelled'], default: 'requested' },
  },
  { timestamps: true },
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  await mongoose.connect(process.env.MONGODB_URI);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed.' });
  }

  try {
    const { name, phone, service } = request.body || {};
    if (!name || !phone || !service) {
      return response.status(400).json({ message: 'Name, phone, and service are required.' });
    }

    await connectDatabase();
    const booking = await Booking.create({ name, phone, service });
    return response.status(201).json({ id: booking._id, message: 'Booking request received.' });
  } catch (error) {
    console.error('Booking creation failed:', error);
    return response.status(500).json({ message: 'Unable to save booking right now.' });
  }
}