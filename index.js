const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const {token} = require('./config.json');
const {Player} = require('discord-player');


//#region slash commands setup
const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);
//#endregion

//#region music player
const playerOptions = {
    LeaveOnEmptyCooldown: 60000,
}
const player = new Player(client,playerOptions)

client.player = player

client.once('ready',async () => {
    console.log('Client Ready!');
});

player.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
  });
  
  player.on('connectionError', (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
  });
  
  player.on('trackStart', (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** by **${track.author}**!`);
  });

  player.on('trackAdd', (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** by **${track.author}** queued!`);
  });

  player.on('tracksAdd', (queue, tracks) => {
    queue.metadata.send(`🎶 | Tracks **${tracks}** queued!`);
  });
  
  player.on('botDisconnect', queue => {
    queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
  });
  
  player.on('channelEmpty', queue => {
    queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
  });
  
  player.on('queueEnd', queue => {
    queue.metadata.send('✅ | Queue finished!');
  });
  
  client.once('reconnecting', () => {
    console.log('Reconnecting!');
  });
  
  client.once('disconnect', () => {
    console.log('Disconnect!');
  });

//#endregion

//#region slash commands deploy TODO:automatic deployment

client.on("guildCreate", async (guild) => {
    if (!client.application?.owner) await client.application?.fetch();
  
        await guild.commands.set(client.commands).then(() => {
          guild.systemChannel.send("Commands Deployed Successfully!");
        })
        .catch((err) => {
          guild.systemChannel.send("Could not deploy commands! Make sure the bot has the application.commands permission!");
          console.error(message.guild + ": " + err)
        });
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();
  
    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set(client.commands).then(() => {
          message.reply("Deployed!");
        })
        .catch((err) => {
          message.reply("Could not deploy commands! Make sure the bot has the application.commands permission!");
          console.error(err)
        });
    }
  });

//#endregion

  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName.toLowerCase());
    const clientCommands = ['ban','useinfo']
    try {
      if (clientCommands.includes(interaction.commandName)){
        command.execute(interaction, client);
      } else {
        command.execute(interaction, player);
      }
    } catch (error) {
      console.error(error);
      interaction.followUp({
        content: 'There was an error trying to execute that command!',
      });
    }
  });


client.login(token);