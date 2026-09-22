 # ESSA Car Wash Service

 MERN project structure for ESSA Service Station.

 ## Structure

 - `client/` React, TypeScript, Vite, Three.js, and the responsive website
 - `server/` Express API, Mongoose model, and MongoDB booking endpoint

 ## Setup

Copy `server/.env.example` to `server/.env`, then set:

 ```env
 MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/essa-car-wash
 PORT=5000
 CLIENT_ORIGIN=http://localhost:5173
 ```

 Install dependencies from the project root:

 ```bash
 npm install
 ```

 Run the client and server together:

 ```bash
 npm run dev
 ```

 Build the client:

 ```bash
 npm run build
 ```

 The booking form saves requests through `POST /api/bookings` into MongoDB.
