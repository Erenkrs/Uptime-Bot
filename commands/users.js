const { MessageEmbed } = require('discord.js');
const User = require('../models/User'); 

module.exports = {
  name: 'users',
  description: 'Kayıtlı kullanıcıları göster',
  async execute(message, args) {
    try {
      const users = await User.find();
  
      users.sort((a, b) => b.premium - a.premium);

      const totalUsers = users.length;

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Kayıtlı Kullanıcılar (${totalUsers} Kişi)`);

      users.forEach((user) => {
        const emoji = user.premium ? '<:premium:1203010677321633896> ' : '<:free:1202930398183559218> ';

        embed.addFields(
          { name: `${emoji} ${user.username}`, value: ` ` }
        );
      });
  
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('MongoDB\'den kullanıcıları alırken bir hata oluştu:', error);
      message.reply('Kullanıcıları alırken bir hata oluştu.');
    }
  },
};
