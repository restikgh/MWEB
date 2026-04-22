const express = require('express');
const cors = require('cors');

const formulirRoutes = require('./routes/formulirRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API formulir berjalan');
});

app.use('/formulir', formulirRoutes);

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});

