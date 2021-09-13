const {GuildMember} = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'Get the current song queue',
  async execute(interaction, player) {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      });
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
    ) {
      return void interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      });
    }

    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue)
      return void interaction.followUp({
        content: '❌ | No tracks in queue!',
      });

    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
        return `${i + 1}. **${m.title}** ([link](${m.url}))`;
    });

    return void interaction.followUp({
        embeds: [
            {
                title: "Server Queue",
                description: `${tracks.join("\n")}${
                    queue.tracks.length > tracks.length
                        ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
                        : ""
                }`,
                color: 0xff0000,
                fields: [{ name: "Now Playing", value: `🎶 | **${currentTrack.title}** by **${track.author}** ([link](${currentTrack.url}))` }]
            }
        ],
    });
  },
};