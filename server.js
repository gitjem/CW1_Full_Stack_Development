const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection
const url = "mongodb+srv://jemima:DUYgXiOt8rROJxAt@cluster0.hkef3rc.mongodb.net/afterSchoolDB?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);
let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db('afterSchoolDB'); 
    console.log('Connected to MongoDB');

    // Start the server
    app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}


// Routes 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/search', async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase() || '';

    // If search box is empty, show all lessons
    if (query === '') {
      const allLessons = await db.collection('lessons').find({}).toArray();
      return res.json(allLessons);
    }

    const numericQuery = Number(query);
    const isNumeric = !isNaN(numericQuery);

    const filter = isNumeric? {
        $or: [
            // convert to string for partial match
            { price: { $regex: query, $options: 'i' } },
            { spaces: { $regex: query, $options: 'i' } },
          ],
    }
    : {
        $or: [
            { subject: { $regex: query, $options: 'i' } }, // finds anything that contains the query
            { location: { $regex: query, $options: 'i' } }, // options for Mongodb search results - case insensitive (i)
        ],
    };
    const lessons = await db.collection('lessons').find(filter).toArray();

    res.json(lessons);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Connect and start server
startServer();

