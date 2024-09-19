const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
export async function adicionarLog(user) {
    try {
        await prisma.loglogin.create({
            data:{nome:user.nome,role:user.role}
        })
    } catch (error) {
        console.error('Erro ao adicionar log de login', error);
    }
}