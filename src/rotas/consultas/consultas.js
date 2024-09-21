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

router.post("/consultas",requireAuth,isAdmin, async(req,res)=>{
    const {idMedico,idPaciente,dataHorario} = req.body
    try {
        if(!idMedico || !idMedico.trim() || !idPaciente || !idPaciente.trim() || !dataHorario || !dataHorario.trim()){
            throw new Error("Nenhum campo pode estar em branco")
        }
        const consulta = await prisma.consulta.create({
            data: {idMedico,idPaciente,dataHorario},
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
        res.status(201).json(consulta)
    } catch (error) {
        res.status(400).json({message: "Erro ao criar uma consulta", error: error.message})
    }
});

router.get("/consultas", requireAuth, isAdmin, async(req,res)=>{
    try {
        const consultas = await prisma.consulta.findMany({
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
        res.status(200).json(consultas);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consultas", error: error.message})
    }
})

router.get("/consultas/:id", requireAuth, isAdmin, async(req,res)=>{
    const {id} = req.params;
    try {
        if(!id) throw new Error("ID não informado")
        const consulta = await prisma.consulta.findUnique({
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
        });
        res.status(200).json(consulta);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consulta", error: error.message})
    }
})

router.get("/consultas/pacientes/:idPaciente", requireAuth, async(req,res)=>{
    const {idPaciente} = req.params
    try {
        if(!idPaciente) throw new Error("ID do paciente não informado")
        const consultas = await prisma.consulta.findMany({
            where: idPaciente,
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
        res.status(200).json(consultas);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consulta", error: error.message})
    }
});

router.get("/consultas/medicos/:idMedico", requireAuth, async(req,res)=>{
    const {idMedico} = req.params
    try {
        if(!idMedico) throw new Error("ID do médico não informado")
        const consultas = await prisma.consulta.findMany({
            where: idMedico,
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
        res.status(200).json(consultas);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consulta", error: error.message})
    }
});