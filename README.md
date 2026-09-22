# ESSA Car Wash Service

A MERN car wash website for ESSA Service Station, Tando Adam.

## Project Structure

```text
client/   React, TypeScript, Vite, Three.js, and the website UI
server/   Express, Mongoose, MongoDB connection, and booking API
```

## Client

```bash
cd client
npm install
npm run dev
```

Build the client:

```bash
npm run build
```

## Server

Create `server/.env` from `server/.env.example`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/essa-car-wash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Run the API:

```bash
cd server
npm install
npm run dev
```

The booking endpoint is:

```text
POST http://localhost:5000/api/bookings
```

The location is ESSA Service Station, By Pass Link Rd, Tando Adam, 68050.
