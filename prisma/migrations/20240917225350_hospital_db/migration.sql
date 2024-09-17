/*
  Warnings:

  - The primary key for the `Consulta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dataHorario` on the `Consulta` table. All the data in the column will be lost.
  - The primary key for the `Exame` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dataHorario` on the `Exame` table. All the data in the column will be lost.
  - You are about to drop the column `nomeDoExame` on the `Exame` table. All the data in the column will be lost.
  - The primary key for the `Medico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dataNascimento` on the `Medico` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `Medico` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Medico` table. All the data in the column will be lost.
  - You are about to drop the column `especialidade` on the `Medico` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Medico` table. All the data in the column will be lost.
  - The primary key for the `Paciente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Administrador` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_idMedico_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_idPaciente_fkey";

-- DropForeignKey
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_idMedico_fkey";

-- DropForeignKey
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_idPaciente_fkey";

-- DropIndex
DROP INDEX "Medico_email_key";

-- AlterTable
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_pkey",
DROP COLUMN "dataHorario",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "idMedico" SET DATA TYPE TEXT,
ALTER COLUMN "idPaciente" SET DATA TYPE TEXT,
ADD CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Consulta_id_seq";

-- AlterTable
ALTER TABLE "Exame" DROP CONSTRAINT "Exame_pkey",
DROP COLUMN "dataHorario",
DROP COLUMN "nomeDoExame",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "idPaciente" SET DATA TYPE TEXT,
ALTER COLUMN "idMedico" SET DATA TYPE TEXT,
ADD CONSTRAINT "Exame_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Exame_id_seq";

-- AlterTable
ALTER TABLE "Medico" DROP CONSTRAINT "Medico_pkey",
DROP COLUMN "dataNascimento",
DROP COLUMN "deleted",
DROP COLUMN "email",
DROP COLUMN "especialidade",
DROP COLUMN "senha",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Medico_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Medico_id_seq";

-- AlterTable
ALTER TABLE "Paciente" DROP CONSTRAINT "Paciente_pkey",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'paciente',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Paciente_id_seq";

-- DropTable
DROP TABLE "Administrador";

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "Medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "Medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exame" ADD CONSTRAINT "Exame_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
