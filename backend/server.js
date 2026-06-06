const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clientesRoutes = require('./routes/clientes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/clientes', clientesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});