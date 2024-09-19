const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { SECRET_KEY } = require('./config');
const { adicionarLog } = require('./log/loginLog');

const prisma = new PrismaClient();

async function authenticate(req, res) {
  const { email, senha } = req.body;

  try {
    // Procurar em todas as entidades (Paciente, Medico, Admin)
    const user = await prisma.paciente.findUnique({
      where: { email },
      select: { id: true, nome: true, senha: true, deleted: true, email: true, role: true }
    }) || await prisma.medico.findUnique({
      where: { email },
      select: { id: true, nome: true, senha: true, deleted: true, email: true, role: true }
    }) || await prisma.administrador.findUnique({
      where: { email },
      select: { id: true, nome: true, senha: true, email: true, role: true }
    });

    if (!user || user.deleted) {
      return res.status(401).json({ message: 'Usuário não encontrado ou deletado' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Gerar token JWT com o papel do usuário
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, {
      expiresIn: '1h'
    });

    req.user = { id: user.id, email: user.email, role: user.role }; // Adiciona o papel do usuário ao req.user
    adicionarLog(user); // Adiciona o log de login

    // Retornar a resposta de sucesso com o token
    res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao autenticar', error });
  }
}

module.exports = { authenticate };