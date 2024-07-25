import { Client, GatewayIntentBits, BaseGuildTextChannel, ChannelType } from 'discord.js';
import registerCommands from './Commands';
import { Config } from "./Config";

const client = new Client({ intents: [GatewayIntentBits.Guilds, 'GuildModeration'] });

client.on('ready', () => {
    new Promise((resolve, reject) => {
        registerCommands().then(() => resolve('done')).catch(reject)
    }).then(e => console.log('Bot is here'))
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "about") {
        await interaction.reply('I know who you are')
    }

    if (interaction.commandName === "prune") {
        const collector = await interaction.channel?.messages.fetch()
        if (interaction.channel?.type === ChannelType.GuildText) {
            const textChannel = interaction.channel as BaseGuildTextChannel;
            await textChannel.bulkDelete(collector!.size);
        }
        await interaction.reply(`Pruned ${collector?.size} messages`)
    }
})

client.login(Config.TOKEN)