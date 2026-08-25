import bcrypt from 'bcryptjs'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@clinicalregistry.com' },
    update: {
      name: 'System Administrator',
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      email: 'admin@clinicalregistry.com',
      name: 'System Administrator',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  const uk = await prisma.country.upsert({
    where: { code: 'GB' },
    update: { name: 'United Kingdom' },
    create: { name: 'United Kingdom', code: 'GB' },
  })

  let hospital = await prisma.hospital.findFirst({
    where: { name: 'St. Thomas Hospital', countryId: uk.id },
  })

  if (!hospital) {
    hospital = await prisma.hospital.create({
      data: {
        name: 'St. Thomas Hospital',
        countryId: uk.id,
        latitude: 51.4985,
        longitude: -0.1181,
      },
    })
  }

  let department = await prisma.department.findFirst({
    where: { name: 'Critical Care', hospitalId: hospital.id },
  })

  if (!department) {
    department = await prisma.department.create({
      data: { name: 'Critical Care', hospitalId: hospital.id },
    })
  }

  let icu = await prisma.iCU.findFirst({
    where: { name: 'Medical ICU', departmentId: department.id },
  })

  if (!icu) {
    icu = await prisma.iCU.create({
      data: { name: 'Medical ICU', departmentId: department.id },
    })
  }

  console.log({ admin, uk, hospital, department, icu })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
