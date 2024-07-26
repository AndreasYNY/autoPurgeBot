import { REST, Routes } from "discord.js";
import { Config } from "./Config";

const rest = new REST({version: "10"}).setToken(Config.TOKEN)

const commands = [
    {
        name: "about",
        description: "Get information about the bot"
    },
    {
        name: "purge",
        description: "Manually purge messages"
    },
    {
        name: "setautopurge",
        description: "Send this command in the channel you want to purge automatically"
    },
    {
        name: "unsetautopurge",
        description: "Send this command in the channel you want to remove from automatically pruning"
    }
]

export default async function registerCommands() {
    try {
        console.log("Trying to register commands")
        await rest.put(Routes.applicationCommands(Config.CLIENT_ID), {body: commands})
        console.log(`Successfully registered commands: ${commands.map(e => e.name).join(", ")}`)
    } catch (error) {
        console.error(error)
    }
}
