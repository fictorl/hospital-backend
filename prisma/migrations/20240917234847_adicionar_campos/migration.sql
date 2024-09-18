/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Medico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataHorario` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataHorario` to the `Exame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeExame` to the `Exame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataNascimento` to the `Medico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Medico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `especialidade` to the `Medico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Medico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consulta" ADD COLUMN     "dataHorario" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Exame" ADD COLUMN     "dataHorario" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nomeExame" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Medico" ADD COLUMN     "dataNascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "especialidade" TEXT NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Medico_email_key" ON "Medico"("email");
