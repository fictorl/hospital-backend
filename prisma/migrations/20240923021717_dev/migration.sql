-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "estadoCivil" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'paciente'
);

-- CreateTable
CREATE TABLE "Medico" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "CRI" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'medico'
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idMedico" TEXT NOT NULL,
    "idPaciente" TEXT NOT NULL,
    "dataHorario" DATETIME NOT NULL,
    CONSTRAINT "Consulta_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "Medico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consulta_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idMedico" TEXT NOT NULL,
    "idPaciente" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "dataHorario" DATETIME NOT NULL,
    "nomeExame" TEXT NOT NULL,
    CONSTRAINT "Exame_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "Medico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exame_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Administrador" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'administrador'
);

-- CreateTable
CREATE TABLE "loglogin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "dataHorario" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_CPF_key" ON "Paciente"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_email_key" ON "Paciente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_CRI_key" ON "Medico"("CRI");

-- CreateIndex
CREATE UNIQUE INDEX "Medico_email_key" ON "Medico"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_email_key" ON "Administrador"("email");
