import { EnvConfig } from "@/types/env.types";
import { neon } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = 'edge';
const app = new Hono().basePath('/api');



app.use('/*', cors({
  origin: [process.env.NEXT_PUBLIC_FRONTEND_URL as string],
  allowMethods: ['GET'],
}));

app.get('/search/redis', async (c) => {
  try {
    const { UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN } = env<EnvConfig>(c);
    const start = performance.now();

    const redis = new Redis({
      url: UPSTASH_REDIS_URL,
      token: UPSTASH_REDIS_TOKEN,
    });

    const query = c.req.query('q')?.toUpperCase();
    if (!query || query.trim() === '') {
      return c.json({
        error: 'Query parameter "q" is required.',
      }, 400);
    }

    const res = [];
    const rank = await redis.zrank('autocomplete:countries', query);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>('autocomplete:countries', rank, rank + 100);

      for (const el of temp) {
        if (!el.startsWith(query)) break;

        if (el.endsWith('*')) {
          res.push(el.substring(0, el.length - 1));
        }
      }
    }

    const end = performance.now();

    return c.json({
      result: res,
      duration: end - start,
    });
  } catch (error) {
    console.error("Error in /search/redis endpoint:", error);

    return c.json({
      result: [],
      message: 'Something went wrong!',
    }, 500);
  }
});



app.get('/search/postgresql', async (c) => {
  try {
    const { NEON_DB_CONNECTION_STRING } = env<EnvConfig>(c);
    const start = performance.now();

    const sql = neon(NEON_DB_CONNECTION_STRING);

    const query = c.req.query('q')?.toUpperCase();
    if (!query || query.trim() === '') {
      return c.json({
        error: 'Query parameter "q" is required.',
      }, 400);
    }

    const results = await sql`
      SELECT name FROM countries
      WHERE name LIKE ${query + '%'}
      ORDER BY name
      LIMIT 10;
  `;

    const res = results.map(row => row.name);
    const end = performance.now();

    return c.json({
      result: res,
      duration: end - start,
    });
  } catch (error) {
    console.error("Error in /search-postgres endpoint:", error);
    return c.json({
      result: [],
      message: 'Something went wrong!',
    }, 500);
  }
});



export const GET = handle(app);
export default app as never;
