import { CacheType, ChatInputCommandInteraction, ChannelType, BaseGuildTextChannel } from 'discord.js';
import fs from 'fs';
import { Client } from 'discord.js';
import { jobsFile, jobs } from '../Config';


export async function addPurgeJob(interaction: ChatInputCommandInteraction<CacheType>, {channelId}: {channelId: string}) {
    try {
        if (jobs.find((job: {channelId: string}) => job.channelId === channelId)) {
            return await interaction.reply(`Job for channel ${channelId} already exists`);
        }
        jobs.push({channelId, lastRun: null});
        fs.writeFileSync(jobsFile, JSON.stringify(jobs));
        console.log(`Added job for channel ${channelId}`);
        return await interaction.reply(`Added job for channel ${channelId}`);
    } catch (error) {
        await interaction.reply(`Error: ${error}`);
    }
}

export async function removePurgeJob(interaction: ChatInputCommandInteraction<CacheType>, {channelId}: {channelId: string}) {
    try {
        if (!jobs.find((job: {channelId: string}) => job.channelId === channelId)) {
            return await interaction.reply(`Job for channel ${channelId} does not exist`);
        }
        fs.writeFileSync(jobsFile, JSON.stringify(jobs.filter((job: {channelId: string}) => job.channelId !== channelId)));
        console.log(`Removed job for channel ${channelId}`);
        return await interaction.reply(`Removed job for channel ${channelId}`);
    } catch (error) {
        await interaction.reply(`Error: ${error}`);
    }
}

export default async function purgeChannel( client: Client,{channelId}: {channelId: string}) {
    const channel = client.channels.cache.get(channelId);
    if (channel && channel.type === ChannelType.GuildText) {
        channel.send("Purging the channel, please be patient :)")
        const textChannel = channel as BaseGuildTextChannel;
        let messages = await channel.messages.fetch({limit: 100});
        while (messages.size > 0) {
            await textChannel.bulkDelete(messages);
            messages = await channel.messages.fetch({limit: 100});
        }
    }
}