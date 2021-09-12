const {GuildMember} = require('discord.js');

module.exports = {
  name: 'nightcore',
  description: 'Applies nightcore filter!',
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
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
      await queue.setFilters({
        nightcore: !queue.getFiltersEnabled().includes("nightcore"),
        normalizer2: !queue.getFiltersEnabled().includes("nightcore") // because we need to toggle it with bass
      });
      setTimeout(() =>{
        return void interaction.followUp({
        content: `🎵 | nightcore ${queue.getFiltersEnabled().includes("nightcore") ? "Enabled" : "Disabled"}!` });
      }, queue.options.bufferingTimeout);
  },
};
