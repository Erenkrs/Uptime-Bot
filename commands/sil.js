const { MessageEmbed, WebhookClient } = require('discord.js');
const Uptime = require('../models/Uptime');
const User = require('../models/User');

module.exports = {
  name: 'link-sil',
  description: 'Link siler',
  async execute(message, args) {
    try {
      const linkName = args[0];

      if (!linkName) {
        return message.reply('Lütfen Silmek İstediğiniz Link Adını Belirtin.');
      }

      const user = await User.findOne({ discordId: message.author.id });

      if (!user) {
        return message.reply('Kullanıcı Veritabanında Kayıtlı Değil. Önce Link Ekleyin!');
      }

      const linkToRemove = await Uptime.findOne({ userId: message.author.id, name: linkName });

      if (!linkToRemove) {
        return message.reply('Belirttiğiniz İsimde Bir Link Bulunamadı.');
      }

      await linkToRemove.deleteOne();

      const successEmbed = new MessageEmbed()
        .setColor('#EF4747')
        .setTitle('<:f_delete:1202931247538503752> **Başarıyla Sistemden Silindi**', linkToRemove.name, true);

      message.reply({ embeds: [successEmbed] });

      const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1202930574982127616/Hiu2c0p412PR6P1rIIO4e8bCsFbqodVd_IahMME2gXXB0hzxnaTEHMmjNjXR78UPYWDt' });

      const logEmbed = new MessageEmbed()
        .setColor('#EF4747')
        .setDescription(`<:f_delete:1202931247538503752> ** ${message.author.tag} Adlı Kullanıcı Sistemden Link Sildi:  ${linkToRemove.name} **`);

      webhook.send({ embeds: [logEmbed] });
    } catch (error) {
      console.error('Link Silinirken Bir Hata Oluştu:', error);

      const errorEmbed = new MessageEmbed()
        .setColor('#6C5C6B')
        .setDescription('Bir Hata Oluştu, Lütfen Bot Sahibine Bildirin!');

      message.author.send({ embeds: [errorEmbed] });
    }
  },
};
