const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = 'mongodb+srv://maj:e3gYlKhhEVh1yET5@cluster0.xnufi0a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(mongoUri);
let bookings;

client.connect().then(() => {
  bookings = client.db('tutoring').collection('bookings');
  console.log('Connected to MongoDB');
});

// Limit: max 3 bookings per 10 minutes per IP
const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit each IP to 3 booking requests per windowMs
  message: 'Too many bookings from this IP, please try again in 10 minutes.'
});

app.use('/api/bookings', bookingLimiter);

app.post('/api/bookings', async (req, res) => {
  const { name, email, date, time } = req.body;

  // anti-spam validation
  if (
    !name || !email || !date || !time ||
    typeof name !== 'string' || name.length < 2 ||
    !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  ) {
    return res.status(400).send('Please provide a valid name, email, date, and time.');
  }

  // Prevent duplicate bookings for the same slot
  const exists = await bookings.findOne({ date, time });
  if (exists) {
    return res.status(409).send('Slot already booked');
  }

  // Insert booking
  await bookings.insertOne({ 
    name: name.trim(), 
    email: email.trim().toLowerCase(), 
    date, 
    time, 
    createdAt: new Date() 
  });

  res.status(201).send('Booked!');
});



app.get('/api/bookings', async (req, res) => {
  const { date } = req.query;
  const booked = await bookings.find(date ? { date } : {}).toArray();
  res.json(booked);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
