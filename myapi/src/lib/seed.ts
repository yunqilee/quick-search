import {Redis} from "@upstash/redis";
import dotenv from 'dotenv';
import airportsData from './airports.json';

const airports_name = airportsData.airports;

dotenv.config({path: '.env.local'});

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

redis.set('key', 'value').then(result => {
    console.log(result);
});

console.log(airports_name.length)