const express = require('express');
const { SECRET_KEY } = require('../../config');
const { PrismaClient } = require('@prisma/client');
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

router.get('/logs', requireAuth, isAdmin, async (req, res) => {
    try {
        const logs = await prisma.loglogin.findMany({
            select: { id: true, nome: true, dataHorario: true, role: true }
        });
        res.json(logs);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao buscar logs', error: error.message });
    }
});

module.exports = router;