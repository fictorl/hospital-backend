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
        res.status(400).json({message: "Erro ao criar uma consulta", error})
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
        if(consultas.length === 0){
            return res.status(404).json({message: "Nenhuma consulta foi encontrada"})
        }
        res.status(200).json(consultas);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consultas", error})
    }
})

router.get("/consultas/:id", requireAuth, isAdmin, async(req,res)=>{
    const {id} = req.params;
    try {
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

        if(!consulta){
            return res.status(404).json({message: "Nenhuma consulta foi encontrada"})
        }
        res.status(200).json(consulta);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consulta", error})
    }
})

router.get("/consultas/:idPaciente", requireAuth, async(req,res)=>{
    try {
        const {idPaciente} = req.params
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
        if(!consultas){
            return res.status(404).json({message: "Nenhuma consulta foi encontrada para esse paciente"})
        }
        res.status(200).json(consulta);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consulta", error})
    }
});

router.get("/consultas/:idMedico", requireAuth, async(req,res)=>{
    try {
        const {idMedico} = req.params
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
        if(!consultas){
            return res.status(404).json({message: "Nenhuma consulta foi encontrada para esse paciente"})
        }
        res.status(200).json(consulta);
    } catch (error) {
        res.status(400).json({message: "Erro ao buscar consulta", error})
    }
});