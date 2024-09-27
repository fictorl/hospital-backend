const express = require('express');
const { SECRET_KEY } = require('../../config');
const { PrismaClient } = require('@prisma/client');
const expressJwt = require('express-jwt');
const { v4 } = require('uuid') 

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

router.post('/exames', requireAuth, isAdmin, async (req,res) => {
    const { idMedico, idPaciente, dataHorario, nomeExame } = req.body;
    const resultado = "Pendente";
    try {
        if(!idMedico || !idPaciente || !resultado || !dataHorario || !nomeExame) throw new Error('Nenhum campo pode estar em branco');
        

        const exame = await prisma.exame.create({
            data: { id: v4(),idMedico, resultado, idPaciente, dataHorario, nomeExame },
            include: {
                medico: {
                    select: {
                        nome: true,
                        CRI: true,
                        especialidade: true
                    }
                },
                paciente: {
                    select: {
                        nome: true,
                        CPF: true
                    }
                }
            }
        });
        res.status(201).json(exame);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar exame', error: error.message });
    }
});

router.get('/exames',  requireAuth, isAdmin, async (req, res) => {
    try {
        const exames = await prisma.exame.findMany({
            include: {
                medico: {
                    select: {
                        nome: true,
                        CRI: true,
                        especialidade: true
                    }
                },
                paciente: {
                    select: {
                        nome: true,
                        CPF: true
                    }
                }
            }
        });
        res.status(201).json(exames);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao procurar exames', error: error.message });        
    }
});

router.get('/exames/:id', requireAuth, isAdmin, async (req, res) =>{
    const { id } = req.params;
    try {
        if(!id) throw new Error('Nenhum campo pode estar em branco');
        const exame = await prisma.exame.findUnique({
            where: {id},
            include: {
                medico: {
                    select: {
                        nome: true,
                        CRI: true,
                        especialidade: true
                    }
                },
                paciente: {
                    select: {
                        nome: true,
                        CPF: true
                    }
                }
            }         
        })
        res.status(200).json(exame);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao procurar exame', error: error.message });        
    }
});

router.get('/exames/medicos/:idMedico', requireAuth, async (req, res) =>{
    const { idMedico } = req.params;
    const userId = req.auth.id;
    try {
        if(userId !== idMedico) throw new Error('Você não tem permissão para acessar esses dados');
        if(!idMedico) throw new Error('Nenhum campo pode estar em branco');
        const exames = await prisma.exame.findMany({
            where: {idMedico},
            include: {
                medico: {
                    select: {
                        nome: true,
                        CRI: true,
                        especialidade: true
                    }
                },
                paciente: {
                    select: {
                        nome: true,
                        CPF: true
                    }
                }
            }         
        })
        res.status(200).json(exames);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao procurar exames', error: error.message });        
    }
});

router.get('/exames/pacientes/:idPaciente', requireAuth, async (req, res) =>{
    const { idPaciente } = req.params;
    const userId = req.auth.id;
    try {
        if(userId !== idPaciente) throw new Error('Você não tem permissão para acessar esses dados');
        if(!idPaciente) throw new Error('Nenhum campo pode estar em branco');
        const exames = await prisma.exame.findMany({
            where: {idPaciente},
            include: {
                medico: {
                    select: {
                        nome: true,
                        CRI: true,
                        especialidade: true
                    }
                },
                paciente: {
                    select: {
                        nome: true,
                        CPF: true
                    }
                }
            }         
        })

        res.status(200).json(exames);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao procurar exames', error: error.message });        
    }
});

router.put('/exames/:idExame', requireAuth, isAdmin, async (req, res) => {
    const { idExame } = req.params;
    const { resultado } = req.body;
    try {
        if(!idExame) throw new Error('ID não informado');
        if(!resultado || !resultado.trim()) throw new Error('Nenhum campo pode estar em branco');
        const exame = await prisma.exame.update({
            where: { id: idExame },
            data: { resultado },
            select: { id: true, nome: true, CRI: true, sexo: true, dataNascimento: true, especialidade: true }
        });
        res.status(200)
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar o exame', error });
    }
});

module.exports = router