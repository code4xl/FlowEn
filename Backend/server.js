const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const uploadRoutes = require('./routes/upload');

const app = express();

// Allow requests from specific origin (frontend domain)
// const allowedOrigins = ['https://shree-vidya-saraswati-pujan.netlify.app'];
const allowedOrigins = process.env.ALLOWED_ORIGINS;
app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        // console.log("errorrrr...")
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to the ReGenest Server.');
  });

app.use('/api/auth', authRoutes);
app.use('/api/user', accountRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Following code for running the server on specific network i.e. IP
// app.listen(PORT, '10.112.9.12', () => {
//     console.log(`Server running on port ${PORT}`);
//   });
