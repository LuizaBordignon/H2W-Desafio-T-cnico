const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET
router.get('/', async (req, res) => {
    try{
        const resultado = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
        res.json(resultado.rows);
    }catch (erro){
        res.status(500).json({ messagem: 'Erro ao buscar clientes'});
    }
});

// POST

router.post('/', async (req,res) => {
    const {nome,email,telefone} = req.body;
    try{
        const resultado = await pool.query(
            'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *', 
            [nome, email, telefone]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao criar cliente'});
    }
});

// PUT

router.put('/:id', async (req,res) => {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;
    try{
        const resultado = await pool.query(
        'UPDATE clientes SET nome=$1, email=$2, telefone=$3 WHERE id=$4 RETURNING *',
        [nome, email, telefone, id]
        );
        res.json(resultado.rows[0])
    }catch (erro){
        res.status(500).json({ mensagem: 'Erro ao editar cliente '});
    }
});

//DELETE

router.delete('/:id', async (req,res) => {
    const { id } = req.params;
    try{
        await pool.query('DELETE FROM clientes WHERE id=$1', [id]);
        res.json({ mensagem: 'Cliente removido '});
    } catch(erro){
        res.status(500).json({mensagem: 'Erro ao remover cliente'});
    }
});

module.exports = router;
