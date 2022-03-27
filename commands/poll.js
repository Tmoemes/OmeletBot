const Discord = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'Create A Poll',
    options: [
      {
        name: 'title',
        type: 3, // 'STRING' Type
        description: 'The title of the poll',
        required: true,
      },{
        name: 'option-1',
        type: 3, // 'String' Type
        description: 'Option 1 for the poll',
        required: false,
      },{
        name: 'option-2',
        type: 3, // 'String' Type
        description: 'Options for the poll',
        required: false,
      },{
        name: 'option-3',
        type: 3, // 'String' Type
        description: 'Options for the poll',
        required: false,
      },{
        name: 'option-4',
        type: 3, // 'String' Type
        description: 'Option 1 for the poll',
        required: false,
      },{
        name: 'option-5',
        type: 3, // 'String' Type
        description: 'Options for the poll',
        required: false,
      },{
        name: 'option-6',
        type: 3, // 'String' Type
        description: 'Options for the poll',
        required: false,
      },{
        name: 'option-7',
        type: 3, // 'String' Type
        description: 'Options for the poll',
        required: false,
      },{
        name: 'option-8',
        type: 3, // 'String' Type
        description: 'Option 1 for the poll',
        required: false,
      },{
        name: 'option-9',
        type: 3, // 'String' Type
        description: 'Options for the poll',
        required: false,
      },{
        name: 'option-10',
        type: 3, // 'String' Type
        description: 'Options for the poll',
        required: false,
      }
    ],
    async execute(interaction) {
        try {
            optionsAmount = 0
        optionsMessage = ""
        let numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']
        for (let index = 1; index <= 10; index++) {
            if(interaction.options.get(`option-${index}`)){
                optionsAmount++
                optionsMessage += `${index}: ${interaction.options.get(`option-${index}`).value}\n`
            }
        }
        let embed = new Discord.MessageEmbed()
        .setColor("#55FFFF")
        .setDescription(optionsMessage)
        .setFooter('Created by ' + interaction.user.username)
        .setThumbnail('https://cdn.discordapp.com/attachments/711339052850479146/711699046296715264/PandaQuestion.png')
        .setTitle('**' + interaction.options.get('title').value + '**')
        
        
        interaction.channel.send({embeds:[embed]}).then(sentEmbed => {
            if(optionsAmount > 0){
                for (let index = 0; index < optionsAmount; index++) {
                    sentEmbed.react(numbers[index])
                }
            }else{
                sentEmbed.react('✔️')
                sentEmbed.react('❌')                
            }
            interaction.reply({content:"Poll Created!",ephemeral: true,})
            
        })
        } catch (error) {
            console.log(error);
            interaction.followUp({
              content: 'There was an error trying to execute that command: ' + error.message,
            });
        }
    }
}