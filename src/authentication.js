const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { SECRET_KEY } = require('./config');

const prisma = new PrismaClient();

async function authenticate(req, res) {
    const { email, senha } = req.body;
    try {
      const user = await prisma.paciente.findUnique({
        where: { email },
        select: { id: true, senha: true, deleted: true }
      }) || await prisma.medico.findUnique({
        where: { email },
        select: { id: true, senha: true, deleted: true }
      });
  
      if (!user || user.deleted) {
        return res.status(401).json({ message: 'Usuário não encontrado ou deletado' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }
  
      res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao autenticar', error });
    }
}

module.exports = { authenticate };
