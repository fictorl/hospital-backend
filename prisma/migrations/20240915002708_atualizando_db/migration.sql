-- AlterTable
ALTER TABLE "Medico" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
