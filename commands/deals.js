const { SlashCommandBuilder, bold } = require('@discordjs/builders');
const getPepperDeals = require('../modules/getPepperDeals');
const processDealsToEmbeds = require('../utils/processDealsToEmbeds');
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

      const embeds = processDealsToEmbeds(deals);
 
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