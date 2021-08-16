const { MessageEmbed } = require('discord.js');

class DefaultEmbed extends MessageEmbed {
  constructor () {
    super();
    this.color = '#ff7f27';
    this.thumbnail = {
      url: 'https://i.imgur.com/hauPqht.png',
    },
    this.timestamp = new Date();
    this.footer = {
      text: 'Pepper BOT',
      icon_url: 'https://i.imgur.com/hauPqht.png'
    };
  }
}

module.exports = DefaultEmbed