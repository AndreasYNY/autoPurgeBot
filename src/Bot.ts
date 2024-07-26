import { Client, GatewayIntentBits, BaseGuildTextChannel, ChannelType, GuildMember } from 'discord.js';
import { Config } from "./Config";
import purgeChannel ,{ addPurgeJob, removePurgeJob } from './Modules/AutoPurge';
import registerCommands from './Commands';
import cronInit from './Cron';

export const client = new Client({ intents: [GatewayIntentBits.Guilds, 'GuildModeration', 'GuildMessages'] });

client.on('ready', () => {
    new Promise((resolve, reject) => {
        cronInit()
        registerCommands().then(() => resolve('done')).catch(reject)
    }).then(e => console.log('Bot is here'))
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "about") {
        purgeChannel(client, {channelId:interaction.channelId})
        await interaction.reply("idk if that work")
    }

    if (interaction.commandName === "purge") {
        const collector = await interaction.channel?.messages.fetch()
        if (interaction.channel?.type === ChannelType.GuildText) {
            const textChannel = interaction.channel as BaseGuildTextChannel;
            await textChannel.bulkDelete(collector!.size);
        }
        await interaction.reply(`Purged ${collector?.size} messages`)
    }

    if (interaction.commandName === "setautopurge") {
        const mem = interaction.member as GuildMember
        if (!mem.permissions.has("ManageMessages")) {
            await interaction.reply("You don't have the required permissions")
        } else {
            addPurgeJob(interaction, {channelId: interaction.channelId})
        }
    }

    if (interaction.commandName === "unsetautopurge") {
        const mem = interaction.member as GuildMember
        if (!mem.permissions.has("ManageMessages")) {
            await interaction.reply("You don't have the required permissions")
        } else (
            removePurgeJob(interaction, {channelId: interaction.channelId})
        )
    }
})

client.login(Config.TOKEN)