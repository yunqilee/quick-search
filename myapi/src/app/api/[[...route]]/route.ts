import {Hono} from "hono";
import {env} from "hono/adapter"
import {handle} from "hono/vercel";
import {Redis} from "@upstash/redis/cloudflare";
import {cors} from "hono/cors";

export const runtime = "edge"

const app = new Hono().basePath('/api')

type EnvConfig = {
    UPSTASH_REDIS_REST_URL: string
    UPSTASH_REDIS_REST_TOKEN: string
}

app.use('/*', cors())
app.get('/search', async (c) => {
    try {
        const {UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN} = env<EnvConfig>(c)

        const start = performance.now();

        const redis = new Redis({
            url: UPSTASH_REDIS_REST_URL,
            token: UPSTASH_REDIS_REST_TOKEN,
        })
        console.log(UPSTASH_REDIS_REST_URL)
        const query = c.req.query('q')?.toLowerCase()

        const resp = []
        const rank = await redis.zrank('2terms', query)
        if (rank !== null && rank !== undefined) {
            const temp = await redis.zrange<string[]>('2terms', rank, rank + 100)

            for (const el of temp) {
                // @ts-ignore
                if (!el.startsWith(query)) {
                    break
                }

                if (el.endsWith('*')) {
                    resp.push(el.substring(0, el.length - 1))
                }
            }
        }

        const end = performance.now();

        return c.json({
            "response": resp,
            "duration": end - start,
        })
    } catch (error) {
        console.error(error)

        return c.json({
            "response": [],
            "message": 'Something went wrong when fetching redis data.'
        })
    }
})

export const GET = handle(app)
export default app as never