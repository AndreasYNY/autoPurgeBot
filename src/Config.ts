import dotenv from "dotenv"
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

export const Config: config = {
    TOKEN: process.env.DISCORD_TOKEN!,
    CLIENT_ID: process.env.CLIENT_ID!,
    APP_ID: process.env.APP_ID!
}