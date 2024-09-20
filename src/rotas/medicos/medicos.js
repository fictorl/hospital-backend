const express = require('express');
const { SECRET_KEY } = require('../../config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const expressJwt = require('express-jwt');

const router = express.Router();
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
const requireAuth = expressJwt.expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] });

function isAdmin(req, res, next) {
    if (req.auth && req.auth.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores têm acesso a essa rota' });
}

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Rotas CRUD para Médico
router.post('/medicos', async (req, res) => {
    const { nome, CRI, sexo, dataNascimento, especialidade, email, senha } = req.body;
    try {
        const hashedPassword = await hashPassword(senha);
        const medico = await prisma.medico.create({
            data: { nome, CRI, sexo, dataNascimento, especialidade, email, senha: hashedPassword },
            select: { id: true, nome: true, CRI: true, sexo: true, dataNascimento: true, especialidade: true }
        });
        res.json(medico);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar médico', error });
    }
});

router.get('/medicos', requireAuth, isAdmin, async (req, res) => {
    const whereClause = {
        deleted: false
    }
    try {
        const medicos = await prisma.medico.findMany({
            where: whereClause,
            select: { id: true, nome: true, CRI: true, sexo: true, dataNascimento: true, especialidade: true }
        });
        res.json(medicos);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar médicos', error });
    }
});

router.get('/medicos/:id', requireAuth, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const medico = await prisma.medico.findUnique({
            where: { id: id },
            select: { id: true, nome: true, CRI: true, sexo: true, dataNascimento: true, especialidade: true }
        });
        res.json(medico);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar médico', error });
    }
});

router.put('/medicos/:id', requireAuth, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, sexo, dataNascimento, especialidade } = req.body;
    try {
        const medico = await prisma.medico.update({
            where: { id: id },
            data: { nome, sexo, dataNascimento, especialidade },
            select: { id: true, nome: true, CRI: true, sexo: true, dataNascimento: true, especialidade: true }
        });
        res.json(medico);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar médico', error });
    }
});

router.delete('/medicos/:id', requireAuth, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.medico.update({
            where: { id: id },
            data: { deleted: true }
        });
        res.json({ message: 'Médico deletado logicamente' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao deletar médico', error });
    }
});

router.get('/medicos/:id/consultas', requireAuth, async (req, res) => {
    const { id } = req.params;

    if (req.auth.role !== 'medico' || req.auth.id !== id) {
        return res.status(403).json({ message: 'Acesso negado, somente médicos têm acesso a suas consultas.' });
    }

    try {
        const consultas = await prisma.consulta.findMany({
            where: { idMedico: id },
            include: { paciente: true }
        });
        res.json(consultas);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar consultas', error });
    }
});

module.exports = router;
