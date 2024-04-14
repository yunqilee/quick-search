import {Redis} from "@upstash/redis";
import dotenv from 'dotenv';
import airportsData from './airports.json';

const airports_name = airportsData.airports;

dotenv.config({path: '.env.local'});

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})


const processBatch = async (batch: string[]) => {
    for (const airport of batch) {
        const term = airport.toLowerCase();
        const terms = [];
        for (let i = 0; i <= term.length; i++) {
            terms.push({ score: 0, member: term.substring(0, i) });
        }
        terms.push({ score: 0, member: term + '*' });

        // @ts-ignore
        await redis.zadd('2terms', ...terms)
    }
};

const uploadInBatches = async (names: string[], batchSize: number) => {
    for (let i = 0; i < names.length; i += batchSize) {
        const batch = names.slice(i, i + batchSize);
        await processBatch(batch);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

uploadInBatches(airports_name, Math.ceil(airports_name.length / 3)).then(() => {
    console.log('Successfully upload inBatches');
}).catch(error => {
    console.error('There was an error when uploading the data', error);
});
