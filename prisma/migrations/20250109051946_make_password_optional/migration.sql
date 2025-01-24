-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "mobileNo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Employee" ("createdAt", "email", "id", "mobileNo", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "mobileNo", "name", "password", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
CREATE UNIQUE INDEX "Employee_mobileNo_key" ON "Employee"("mobileNo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
