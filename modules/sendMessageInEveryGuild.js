const DefaultEmbed = require('../utils/DefaultEmbed')

module.exports = (client, message, channelName) => {
  client.guilds.cache.map(async (guild) => {
    // Filter channels by name
    let channel = guild.channels.cache.filter(channel => channel.name === channelName)

    // If channel does not exist, create it and send the message to it
    if (Array.from(channel).length === 0) {
      try {
        channel = await guild.channels.create(channelName, "text")
        channel.send(message)
      } catch (error) {
        // Bot does not have permissions to create the channel
        const embed = new DefaultEmbed()
          .setTitle(`I need permissions on **${guild.name}**.`)
          .setDescription(`I dont have permissions to create the channel **${channelName}** on guild named **${guild.name}**.`)
          .addField('Solutions:', `- Create the channel **${channelName}**,\n- Give me permissions to create channels.`)

        const owner = await client.users.fetch(guild.ownerId);
        owner.send({ embeds: [embed] });
      }

      return
    }

    // If channel existed before, send the message to it
    Array.from(channel)[0][1].send(message)
  })
}
  