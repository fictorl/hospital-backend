const express = require('express');
const { SECRET_KEY } = require('../../config');
const { PrismaClient } = require('@prisma/client');
const expressJwt = require('express-jwt');
const e = require('express');

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
    const { idMedico, idPaciente, resultado, dataHorario, nomeExame } = req.body;
    try {
        if(!idMedico || !idPaciente || !resultado || !dataHorario || !nomeExame) throw new Error('Nenhum campo pode estar em branco');
        const exame = await prisma.exame.create({
            data: { idMedico, idPaciente, resultado, dataHorario, nomeExame },
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
        const exames = prisma.exame.findMany({
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
        const exame = prisma.exame.findUnique({
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

        if(!exame){
            return res.status(404).json({message: 'Exame não encontrado'});
        }

        res.status(200).json(exame);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao procurar exame', error: error.message });        
    }
});

router.get('/exames/medicos/:idMedico', requireAuth, isAdmin, async (req, res) =>{
    const { idMedico } = req.params;
    try {
        if(!idMedico) throw new Error('Nenhum campo pode estar em branco');
        const exames = prisma.exame.findMany({
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

        if(exames.length === 0){
            return res.status(404).json({message: 'Lista de exames por médico não encontrada'});
        }
        res.status(200).json(exames);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao procurar exames', error: error.message });        
    }
});

router.get('/exames/pacientes/:idPaciente', requireAuth, isAdmin, async (req, res) =>{
    const { idPaciente } = req.params;
    try {
        if(!idPaciente) throw new Error('Nenhum campo pode estar em branco');
        const exames = prisma.exame.findMany({
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

        if(exames.length === 0){
            return res.status(404).json({message: 'Lista de exames por paciente não encontrada'});
        }

        res.status(200).json(exames);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao procurar exames', error: error.message });        
    }
});