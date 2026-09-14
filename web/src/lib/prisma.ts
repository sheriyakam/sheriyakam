// Safe dynamic Prisma Client loader that handles pre-migration / ungenerated states gracefully
let PrismaClientClass: any;
try {
  // @ts-ignore
  const pkg = require('@prisma/client');
  PrismaClientClass = pkg.PrismaClient;
} catch (e) {
  PrismaClientClass = null;
}

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export const prisma: any =
  globalForPrisma.prisma ??
  (PrismaClientClass
    ? new PrismaClientClass({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : null);

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
