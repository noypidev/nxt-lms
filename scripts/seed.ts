const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
   try {
      await database.category.createMany({
         data: [
            { name: "Computer Science" },
            { name: "Music" },
            { name: "Fitness" },
            { name: "Photography" },
            { name: "Philosophy" },
            { name: "Finance" },
         ],
      });
      console.log("Success seeding the database category records");
   } catch (error) {
      console.log("Error seeding the database category records", error);
   } finally {
      await database.$disconnect();
   }
}

main();