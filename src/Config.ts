import dotenv from "dotenv"
import { join }from 'path';
import fs from 'fs';
dotenv.config()

interface config {
    TOKEN: string;
    CLIENT_ID: string;
    APP_ID: string;
}

if(!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID || !process.env.APP_ID) {
    console.error("Missing environment variable(s)")
    process.exit(1)
}

export const jobsFile = join('cronStuff',"jobs.json");

try {
    const test = JSON.parse(fs.readFileSync(jobsFile).toString());
} catch (error) {
    if (error instanceof SyntaxError) {
        console.error("Error parsing JSON file");
        fs.writeFileSync(jobsFile, JSON.stringify([]));
    }
}

export const jobs:{channelId: string, lastRun: number | null}[] = JSON.parse(fs.readFileSync(jobsFile).toString());


export const Config: config = {
    TOKEN: process.env.DISCORD_TOKEN!,
    CLIENT_ID: process.env.CLIENT_ID!,
    APP_ID: process.env.APP_ID!
}