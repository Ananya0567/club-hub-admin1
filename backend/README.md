# College Clubs Management — Express Backend

## Setup
```bash
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv
npm install -D nodemon
```

## Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/college-clubs
JWT_SECRET=your_jwt_secret_here
```

## Run
```bash
npx nodemon server.js
```

## API Endpoints
See `routes/` folder for all endpoints matching the React frontend.
