CREATE TYPE "Role" AS ENUM ('ADMIN', 'DATA_MANAGER', 'VALIDATOR', 'VIEWER');
CREATE TYPE "FormStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'VALIDATED', 'REJECTED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'VIEWER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Country" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Hospital" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "countryId" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Department" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "hospitalId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ICU" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ICU_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Patient" (
  "id" TEXT NOT NULL,
  "mrn" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3) NOT NULL,
  "gender" TEXT NOT NULL,
  "icuId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DataForm" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "status" "FormStatus" NOT NULL DEFAULT 'DRAFT',
  "data" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DataForm_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FormValidation" (
  "id" TEXT NOT NULL,
  "formId" TEXT NOT NULL,
  "status" "FormStatus" NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FormValidation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");
CREATE UNIQUE INDEX "Patient_mrn_key" ON "Patient"("mrn");

ALTER TABLE "Hospital"
  ADD CONSTRAINT "Hospital_countryId_fkey"
  FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Department"
  ADD CONSTRAINT "Department_hospitalId_fkey"
  FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ICU"
  ADD CONSTRAINT "ICU_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Patient"
  ADD CONSTRAINT "Patient_icuId_fkey"
  FOREIGN KEY ("icuId") REFERENCES "ICU"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DataForm"
  ADD CONSTRAINT "DataForm_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FormValidation"
  ADD CONSTRAINT "FormValidation_formId_fkey"
  FOREIGN KEY ("formId") REFERENCES "DataForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
