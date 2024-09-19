const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });
export async function adicionarLog(user) {
    const date = await getDate()
    try {
        await prisma.loglogin.create({
            data:{nome:user.nome,role:user.role,dataHorario: date }
        })
    } catch (error) {
        console.error('Erro ao adicionar log de login', error);
    }
}

async function getDate() {
    const hora = new Date();
    const dia = String(hora.getDate()).padStart(2, '0');
    const mes = String(hora.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = hora.getFullYear();
    const horas = String(hora.getHours()).padStart(2, '0');
    const minutos = String(hora.getMinutes()).padStart(2, '0');

    const formatedDate = `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    return formatedDate
}