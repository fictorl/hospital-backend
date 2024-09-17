const express = require('express');
const { SECRET_KEY } = require('../../config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const expressJwt = require('express-jwt');

const router = express.Router();
const prisma = new PrismaClient();
const requireAuth = expressJwt.expressjwt({ secret: SECRET_KEY, algorithms: ['HS256'] });

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

function isAdmin(req, res, next) {
    if (req.auth && req.auth.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores têm acesso a essa rota' });
}

// Rotas CRUD para Paciente
router.post('/pacientes', requireAuth, isAdmin, async (req, res) => {
    const { nome, CPF, sexo, dataNascimento, estadoCivil, email, senha } = req.body;
    const hashedPassword = await hashPassword(senha);
    try {
        const paciente = await prisma.paciente.create({
            data: { nome, CPF, sexo, dataNascimento, estadoCivil, email, senha: hashedPassword },
            select: { id: true, nome: true, CPF: true, sexo: true, dataNascimento: true, estadoCivil: true }
        });
        res.json(paciente);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar paciente', error });
    }
});

router.get('/pacientes', requireAuth, isAdmin, async (req, res) => {
    try {
        const pacientes = await prisma.paciente.findMany({
            select: { id: true, nome: true, CPF: true, sexo: true, dataNascimento: true, estadoCivil: true }
        });
        res.json(pacientes);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar pacientes', error });
    }
});

router.get('/pacientes/:id', requireAuth, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const paciente = await prisma.paciente.findUnique({
            where: { id: parseInt(id) },
            select: { id: true, nome: true, CPF: true, sexo: true, dataNascimento: true, estadoCivil: true }
        });
        res.json(paciente);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar paciente', error });
    }
});

router.put('/pacientes/:id', requireAuth, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { nome, sexo, dataNascimento, estadoCivil } = req.body;

    try {
        const paciente = await prisma.paciente.update({
            where: { id: parseInt(id) },
            data: { nome, sexo, dataNascimento, estadoCivil },
            select: { id: true, nome: true, CPF: true, sexo: true, dataNascimento: true, estadoCivil: true }
        });
        res.json(paciente);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar paciente', error });
    }
});

router.delete('/pacientes/:id', requireAuth, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.paciente.update({
            where: { id: parseInt(id) },
            data: { deleted: true }
        });
        res.json({ message: 'Paciente deletado logicamente' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao deletar paciente', error });
    }
});

router.get('/pacientes/:id/consultas', requireAuth, async (req, res) => {
    const { id } = req.params;

    if (req.auth.role !== 'paciente' || req.auth.id !== parseInt(id)) {
        return res.status(403).json({ message: 'Acesso negado, apenas pacientes podem acessar suas consultas.' });
    }

    try {
        const consultas = await prisma.consulta.findMany({
            where: { idPaciente: parseInt(id) },
            include: { medico: true }
        });
        res.json(consultas);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar consultas', error });
    }
});

router.get('/pacientes/:id/exames', requireAuth, async (req, res) => {
    const { id } = req.params;

    if (req.auth.role !== 'paciente' || req.auth.id !== parseInt(id)) {
        return res.status(403).json({ message: 'Acesso negado, apenas pacientes podem acessar seus exames.' });
    }

    try {
        const exames = await prisma.exame.findMany({
            where: { idPaciente: parseInt(id) },
            include: { medico: true }
        });
        res.json(exames);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar exames', error });
    }
});

module.exports = router;
