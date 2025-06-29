/* eslint @typescript-eslint/ban-ts-comment: "error" */
import 'dotenv/config';
import { Redis } from '@upstash/redis';
import countryList from '@/data/country-list.data';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL as string,
  token: process.env.UPSTASH_REDIS_TOKEN as string,
});



const run = async () => {
  await redis.del('autocomplete:countries'); // Clear existing data, for cleaning up before seeding

  const allPrefixes: { score: 0; member: string }[] = [];

  for (const country of countryList) {
    const countryName = country.toUpperCase();
    for (let i = 0; i <= countryName.length; i++) {
      allPrefixes.push({ score: 0, member: countryName.substring(0, i) });
    }
    allPrefixes.push({ score: 0, member: countryName + "*" });
  }

  // @ts-expect-error – Upstash Redis type mismatch (false positive).
  await redis.zadd('autocomplete:countries', ...allPrefixes);
  console.log("✅ Seeded autocomplete:countries successfully!");
};


run().catch((err) => {
  console.error("❌ Failed to seed: ", err);
});
