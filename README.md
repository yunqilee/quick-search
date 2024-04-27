# quick-search
A high performance API combine with redis, get the airport you want
to search in milliseconds.

Inspired by: [joschan21 / fastapi](https://github.com/joschan21/fastapi)

### data source
The link of the original dataset is here:
https://github.com/lxndrblz/Airports

This project picks airports with or near the United States, the total number of it
is 2827.

### technology stack
Redis (Upstash), Next.js, Hono, Cloudflare

### deploy
This project publish its API on Cloudflare via `yarn deploy`, the actual command
is set in package.json
