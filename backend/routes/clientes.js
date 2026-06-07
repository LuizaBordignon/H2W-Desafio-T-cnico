const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET
router.get('/', async (req, res) => {
    try{
        const resultado = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
        res.json(resultado.rows);
    }catch (erro){
        console.error(erro.message);
        res.status(500).json({ mensagem: 'Erro ao buscar cliente'});
    }
});

// POST

router.post('/', async (req, res) => {
  const { nome, email, telefone } = req.body;

  const nomeLimpo = nome?.trim();
  const emailLimpo = email?.trim().toLowerCase(); 
  const telefoneLimpo = telefone?.trim().replace(/\D/g, '');

  if (!nomeLimpo || !emailLimpo || !telefoneLimpo) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  if (!/^\d{8,15}$/.test(telefoneLimpo)) {
    return res.status(400).json({ mensagem: 'Telefone inválido.' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
      [nomeLimpo, emailLimpo, telefoneLimpo]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ mensagem: 'Erro ao criar cliente.' });
  }
});

// PUT

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  const nomeLimpo = nome?.trim();
  const emailLimpo = email?.trim().toLowerCase();
  const telefoneLimpo = telefone?.trim().replace(/\D/g, '');

  if (!nomeLimpo || !emailLimpo || !telefoneLimpo) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  if (!/^\d{8,15}$/.test(telefoneLimpo)) {
    return res.status(400).json({ mensagem: 'Telefone inválido.' });
  }

  try {
    const resultado = await pool.query(
      'UPDATE clientes SET nome=$1, email=$2, telefone=$3 WHERE id=$4 RETURNING *',
      [nomeLimpo, emailLimpo, telefoneLimpo, id] 
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ mensagem: 'Erro ao atualizar cliente.' });
  }
});

//DELETE

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const resultado = await pool.query('DELETE FROM clientes WHERE id=$1', [id]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
    }
    res.json({ mensagem: 'Cliente removido com sucesso.' });
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ mensagem: 'Erro ao remover cliente.' });
  }
});

module.exports = router;
