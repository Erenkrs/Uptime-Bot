const { Permissions } = require('discord.js');
const User = require('../models/User'); 

module.exports = {
  name: 'premium_ver',
  description: 'Belirli bir kullanıcıya premium verir',
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return message.reply('Bu komutu kullanma izniniz yok!');
    }

    if (args.length !== 1) {
      return message.reply('Komutu doğru kullanın: `!premium_ver <userId>`');
    }

    const userId = args[0];

    try {
      const foundUser = await User.findOne({ discordId: userId });

      if (!foundUser) {
        return message.reply('Belirtilen kullanıcı bulunamadı.');
      }

      foundUser.premium = true;

      await foundUser.save();

      message.reply(`Kullanıcıya premium verildi: ${userId}`);
    } catch (error) {
      console.error('MongoDB\'den kullanıcı bulunurken veya güncellenirken bir hata oluştu:', error);
      message.reply('Bir hata oluştu, kullanıcıya premium verilemedi.');
    }
  },
};
