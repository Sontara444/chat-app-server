const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/mongodb');
const userRoutes = require('./routes/auth')

require('dotenv').config(); 

const app = express();
const server = http.createServer(app);

connectDB()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

server.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`);
})


