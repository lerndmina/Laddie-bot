class SlashCommands{
    constructor(client){
        this.client = client
    }

    async getCommands(guildId){
        // Guild-based, instant
        // Global, can take an hour to update
        let commands

        if(guildId){
            const guild = await this.client.guilds.fetch(guildId)
            commands = guild.commands
        } else {
            commands = this.client.application.commands
        }

        await commands.fetch()

        return commands
    }

    async create(name, description, options, guildId){
    const commands = await this.getCommands(guildId)

    const existingCommand = commands.cache.find((cmd) => cmd.name === name)
        if(existingCommand){
            // TODO: Update the command
            console.log(`Command "${name}" already exists, skipping...`)
            return
        }

        await commands.create({
            name,
            description,
            options,
        })
    }

}

module.exports = SlashCommands;