const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    // Verifica se já existe um usuário admin
    const adminExists = await prisma.administrador.findUnique({
        where: { email: 'hospital@admin' }
    });

    if (!adminExists) {
        // Cria o usuário admin com senha criptografada
        const hashedPassword = await bcrypt.hash('1234', 10);
        await prisma.administrador.create({
            data: {
                nome: 'Admin',
                email: 'hospital@admin',
                senha: hashedPassword,
                role: 'admin'
            }
        });
        console.log('Usuário administrador criado com sucesso.');
    } else {
        console.log('Usuário administrador já existe.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
