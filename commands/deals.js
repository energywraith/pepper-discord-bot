const DefaultEmbed = require('../utils/DefaultEmbed')
const { SlashCommandBuilder, bold } = require('@discordjs/builders');
const getPepperDeals = require('../modules/getPepperDeals');
const splitArrayIntoChunks = require('../utils/splitArrayIntoChunks');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deals')
		.setDescription('List of Pepper deals from the home page or the specified one.')
    .addIntegerOption(option =>
      option.setName('page')
        .setDescription('You can specify the page that will be scrapped.')),
	async execute(interaction) {
    const page = interaction.options.getInteger('page')
      ? interaction.options.getInteger('page')
      : 0;

    try {
      const deals = await getPepperDeals(page);
      const embeds = [];

      deals.map(deal => {
        let embed = new DefaultEmbed()
          .setTitle(deal.title)
          .setThumbnail(deal.image)
          .addFields(
            { name: 'Votes', value: deal.votes ? deal.votes : '0', inline: true },
            { name: 'Date', value: deal.lifeTime ? deal.lifeTime : '0', inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
          )
          .addField('Pepper', `[Go to](${deal.articleLink})`, true);
        
        deal.dealLink && embed
          .addField('Deal', `[Go to](${deal.dealLink})`, true)
          .addField('\u200B', '\u200B', true);

        embeds.push(embed);
      })

      await splitArrayIntoChunks(embeds, 10).map(embedChunk =>
        interaction.channel
          ? interaction.channel.send({ embeds: embedChunk })
          : interaction.user.send({ embeds: embedChunk })
      );

      await interaction.reply(bold(`Here\'s a list of all deals from page ${page}:`));
    } catch (error) {
      console.log(error);
      await interaction.reply('Something went wrong...');
    }
	},
};