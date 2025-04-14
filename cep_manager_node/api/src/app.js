const ceproute = require('./routes/cep.route')
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

  console.log(`API Rodando ${PORT}`);
});

app.use('/api',ceproute);
