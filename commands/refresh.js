const fs = require('fs');

module.exports = {
    name: "refresh",
    description: "Refreshes [/] commands",

    async execute(interaction){

        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        }

        await guild.commands.set(client.commands).then(() => {
            interaction.guild.systemChannel.send("Commands Deployed Successfully!");
          })
          .catch((err) => {
            interaction.guild.systemChannel.send("Could not deploy commands! Make sure the bot has the application.commands permission!");
            console.error(message.guild + ": " + err)
          });
    }

}; 