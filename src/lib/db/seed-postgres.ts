import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import countryList from '@/data/country-list.data';

const sql = neon(process.env.NEON_DB_CONNECTION_STRING as string);



const run = async () => {
  try {
    await sql`DELETE FROM countries;`; // Clear existing data, for cleaning up before seeding
    console.log("✅ Cleared existing data in 'countries' table.");

    const countriesToInsert = countryList.map(country => ({ name: country.toUpperCase() }));

    for (const country of countriesToInsert) {
      await sql`INSERT INTO countries (name) VALUES (${country.name}) ON CONFLICT (name) DO NOTHING;`;
    }

    console.log("✅ Seeded countries into PostgreSQL successfully!");
  } catch (err) {
    console.error("❌ Failed to seed PostgreSQL: ", err);
    process.exit(1);
  }
};



run();
