const express = require('express');
const cors = require('cors');
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const clientesRoutes = require('./routes/clientes');

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 900000, // janela de 15 minutos
  max: 100, // máximo de 100 requisições por IP nessa janela
  message: {
    mensagem: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/clientes', clientesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});