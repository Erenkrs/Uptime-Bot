const { MessageEmbed } = require('discord.js');
const User = require('../models/User');
const Uptime = require('../models/Uptime');

module.exports = {
  name: 'istatistik',
  description: 'Bot istatistiklerini gösterir',
  async execute(message, args, client) {
    try {
      const guildCount = client.guilds.cache.size;
      const userCount = client.users.cache.size;
      const ping = Math.round(client.ws.ping);

      const totalUsers = await User.countDocuments();
      const formattedTotalUsers = totalUsers.toString(); 

      const totalLinks = await Uptime.countDocuments();
      const formattedTotalLinks = totalLinks.toString(); 

      const embed = new MessageEmbed()
        .setColor('#3498db')
        .setTitle('Uptime')
        .addField('**Total User**', formattedTotalUsers, true)
        .addField('**Total Link**', formattedTotalLinks, true)

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('İstatistikler alınırken bir hata oluştu:', error);
      message.reply('İstatistikleri alırken bir hata oluştu.');
    }
  },
};
