const DefaultEmbed = require('./DefaultEmbed')

const processDealsToEmbeds = (deals) => {
  const embeds = deals.map(deal => {
    let embed = new DefaultEmbed()
      .setTitle(deal.title)
      .setURL(deal.articleLink)
      .setThumbnail(deal.image)
      .addFields(
        { name: 'Votes', value: deal.votes ? deal.votes : '0', inline: true },
        { name: 'Date', value: deal.lifeTime ? deal.lifeTime : '0', inline: true },
        { name: deal.price ? 'Price' : '\u200B', value: deal.price ? deal.price : '\u200B', inline: true },
      )
    
    deal.dealLink && embed
      .addField('Deal', `[Go to](${deal.dealLink})`, true)
      .addField('\u200B', '\u200B', true);

    return embed;
  });

  return embeds;
}

module.exports = processDealsToEmbeds