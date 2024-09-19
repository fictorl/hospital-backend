-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_loglogin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "dataHorario" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_loglogin" ("dataHorario", "id", "nome", "role") SELECT "dataHorario", "id", "nome", "role" FROM "loglogin";
DROP TABLE "loglogin";
ALTER TABLE "new_loglogin" RENAME TO "loglogin";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
