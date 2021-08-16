// To add the bot on a server
// https://discord.com/api/oauth2/authorize?client_id=876400639855427595&permissions=519232&scope=bot%20applications.commands
const { token } = require('./config.json');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const cron = require('node-cron');
const getPepperDeals = require('./modules/getPepperDeals');
const sendMessageInEveryGuild = require('./modules/sendMessageInEveryGuild');
const processDealsToEmbeds = require('./utils/processDealsToEmbeds');
const splitArrayIntoChunks = require('./utils/splitArrayIntoChunks');
require('./modules/registerCommands')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	// Every 5 mins, 12:05, 12:10, 12:15 etc.
	cron.schedule('*/5 * * * *', async () => {
		try {
			const deals = await getPepperDeals();
			const oldDeals = JSON.parse(await fs.promises.readFile('data/tempDeals.json'));

			// Deals that werent in tempDeals.json
			const newDeals = deals.filter(({ id: id1 }) => !oldDeals.some(({ id: id2 }) => id2 === id1));

			if(newDeals.length > 0) {
				const embeds = processDealsToEmbeds(newDeals);

				await splitArrayIntoChunks(embeds, 10).forEach(embedChunk =>
					sendMessageInEveryGuild(client, { embeds: embedChunk }, 'pepper-deals')
				);

				await fs.promises.writeFile('data/tempDeals.json', JSON.stringify(deals), (err) => err && console.log(error));
			}
		} catch (error) {
			console.log(error);
		}
	});

  console.log('Ready!');
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (!client.commands.has(commandName)) return;

	try {
		await client.commands.get(commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token)

module.exports = client