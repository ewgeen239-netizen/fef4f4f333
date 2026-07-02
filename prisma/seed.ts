import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Weekday slots. Adjust to the studio's real working hours.
const SLOTS = ["10:00", "12:30", "15:00", "17:30"];
const DAYS_AHEAD = 60;

async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows: { date: Date; timeSlot: string }[] = [];

  for (let i = 1; i <= DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const day = d.getDay();
    if (day === 0 || day === 6) continue; // skip weekends
    for (const timeSlot of SLOTS) rows.push({ date: d, timeSlot });
  }

  await prisma.availability.createMany({ data: rows, skipDuplicates: true });
  console.log(`Seeded ${rows.length} availability slots.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
