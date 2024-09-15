const express = require('express');
const medicoRoutes = require('./rotas/medicos/medicos');
const pacienteRoutes = require('./rotas/pacientes/pacientes');

const { authenticate } = require('./authentication');

const app = express();


app.use(express.json());
app.use(medicoRoutes);
app.use(pacienteRoutes);

// Rota de login para pacientes
app.post('/login/paciente', authenticate, (req, res) => {
    res.json({ message: 'Login de paciente bem-sucedido', user: req.user });
  });
  
// Rota de login para médicos
app.post('/login/medico', authenticate, (req, res) => {
res.json({ message: 'Login de médico bem-sucedido', user: req.user });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});