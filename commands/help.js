const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends DM with list of all my commands or info about a specific command.')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('Leave empty to list all commands')),
	async execute(interaction) {
    const { commands } = interaction.client;
    const commandName = interaction.options.getString('command');
    const dataToSend = [];

    if (!commandName) {
      dataToSend.push('Here\'s a list of all my commands:');
      dataToSend.push(Array.from(commands).map(command => `\`${command[0]}\``).join(', '));
      dataToSend.push(`\nYou can send \`/help [command name]\` to get info on a specific command!`);

      try {
        if (!interaction.channel || interaction.channel.type === 'DM') {
          await interaction.reply(dataToSend.join(' '));
        } else {
          await interaction.user.send(dataToSend.join(' '));
          await interaction.reply('I\'ve sent you a DM with all my commands!');
        }
      } catch (error) {
        console.error(`Could not send help DM to ${interaction.user.username}.\n`, error);
        interaction.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
      }

      return;
    }

    const command = commands.get(commandName);

    if (!command) {
      await interaction.reply('that\'s not a valid command!');
      return;
    }

    dataToSend.push(`**Name:** ${command.data.name}`);
    if (command.data.description) dataToSend.push(`**Description:** ${command.data.description}`);

    await interaction.reply(dataToSend.join('\n'));
	},
};