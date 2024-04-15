import {Hono} from "hono";
import {env} from "hono/adapter"
import {handle} from "hono/vercel";
import {Redis} from "@upstash/redis/cloudflare";

export const runtime = "edge"

const app = new Hono().basePath('/api')

type EnvConfig = {
    UPSTASH_REDIS_REST_URL: string
    UPSTASH_REDIS_REST_TOKEN: string
}

app.get('/search', async (c) => {
    const {UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN} = env<EnvConfig>(c)

    const redis = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
    })

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
    console.log(resp)
    return c.json({
        "response": resp,
    })

})

export const GET = handle(app)
export default app as never