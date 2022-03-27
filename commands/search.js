const {GuildMember} = require('discord.js');
const {QueryType,RepeatMode} = require('discord-player');

module.exports = {
  name: 'search',
  description: 'Search for songs',
  options: [
    {
      name: 'query',
      type: 3, // 'STRING' Type
      description: 'The song you want to play',
      required: true,
    },
  ],
  async execute(interaction, player) {
    try {

      const query = interaction.options.get('query').value;
      const searchResult = await player
        .search(query, {
          requestedBy: interaction.user,
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks)
        return void interaction.followUp({content: 'No results were found!'});

      messagecontent = 'Top 5 Search Results: \n'
      for (let index = 0; index < 5; index++) {
        messagecontent += `${index+1}: ${searchResult.tracks[index].toString()}\n` 
      }
      try {
        interaction.reply({content: messagecontent})
      } catch (error) {
        console.log(error);
      interaction.followUp({
        content: 'There was an error trying to execute that command: ' + error.message,
      });
      }

    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'There was an error trying to execute that command: ' + error.message,
      });
    }
  },
};
