const {GuildMember} = require('discord.js');

module.exports = {
  name: 'remove',
  description: 'Remove a song from queue!',
  options: [
    {
      name: 'index',
      type: 4, // 'INTIGER' Type
      description: 'The index of the song you want to remove',
      required: true,
    },
  ],
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
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | No music is being played!'});
    if (interaction.options.get("index").value-1 < 0 ||interaction.options.get("index").value-1 > 10) return void interaction.followUp({content: '❌ | Please give a valid index!'});
    const trackRemove = queue.tracks[interaction.options.get("index").value-1]
    const success = queue.remove(trackRemove);
    return void interaction.followUp({
      content: success ? `✅ | Removed **${trackRemove}**!` : '❌ | Something went wrong!',
    });
  },
};
