import cron from 'node-cron';
import fs from 'fs';
import { client } from './Bot';
import AutoPurge from './Modules/AutoPurge';
import { jobsFile, jobs } from './Config';

export default async function cronInit() {
    if (!fs.existsSync(jobsFile)) {
        fs.writeFileSync(jobsFile, JSON.stringify([]));
    }

    cronRun()
}

function cronRun() {
    console.log("if you see this, the cron job is running");
    // running every 12:00 AM
    cron.schedule('0 0 * * *', () => {
        if (jobs.length === 0) {
            console.log("No jobs to run");
            return;
        }
        jobs.forEach(job => {
            if (!job.lastRun || job.lastRun! < Date.now() - 14 * 24 * 60 * 60 * 1000) {
                AutoPurge(client, {channelId: job.channelId});
            } else {
                console.log(`Skipping job for channel ${job.channelId}`);
                return;
            }
            console.log(`Running job for channel ${job.channelId}`);
            job.lastRun = Date.now();
        });
        fs.writeFileSync(jobsFile, JSON.stringify(jobs));
        console.log(`ran scheduled jobs for ${new Date().toDateString()}`);
    });
}