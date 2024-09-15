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

// Rotas CRUD para Paciente
router.post('/pacientes', async (req, res) => {
    const { nome, CPF, sexo, dataNascimento, estadoCivil, email, senha } = req.body;
    const hashedPassword = await hashPassword(senha);
    const paciente = await prisma.paciente.create({
      data: { nome, CPF, sexo, dataNascimento, estadoCivil, email, senha: hashedPassword },
      select: { id: true, nome: true, CPF: true, sexo: true, dataNascimento: true, estadoCivil: true }
    });
    res.json(paciente);
});
  
router.get('/pacientes', requireAuth, async (req, res) => {
const pacientes = await prisma.paciente.findMany({
    select: { id: true, nome: true, CPF: true, sexo: true, dataNascimento: true, estadoCivil: true }
});
res.json(pacientes);
});

router.get('/pacientes/:id', requireAuth, async (req, res) => {
const { id } = req.params;
const paciente = await prisma.paciente.findUnique({ 
    where: { id: parseInt(id) },
    select: { id: true, nome: true, CPF: true, sexo: true, dataNascimento: true, estadoCivil: true }
});
res.json(paciente);
});

router.put('/pacientes/:id', requireAuth, async (req, res) => {
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

router.put('/pacientes/:id/delete', requireAuth, async (req, res) => {
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

module.exports = router;