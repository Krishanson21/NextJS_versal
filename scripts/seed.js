require('dotenv').config({ path: '.env' });
const bcrypt = require('bcrypt');
const postgres = require('postgres');

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const users = [
    {
      name: 'Krishan',
      email: 'krishantson21@gmail.com',
      password: await bcrypt.hash('123456', 10),
    },
  ];

  for (const user of users) {
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${user.name}, ${user.email}, ${user.password})
      ON CONFLICT (email) DO NOTHING;
    `;
  }
}

async function main() {
  try {
    await seedUsers();
    console.log('Seeded users');
  } catch (error) {
    console.error(error);
  }
}

main();