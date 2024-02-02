const { MessageEmbed, MessageActionRow, MessageButton, WebhookClient } = require('discord.js');
const Uptime = require('../models/Uptime');
const User = require('../models/User');

module.exports = {
    name: 'add-link',
    description: 'Link ekler',
    async execute(message, args) {
        try {
            const linkName = args[0];
            const linkURL = args[1];

            if (!linkName || !linkURL) {
            
                const invalidURLEmbed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setDescription('Lütfen geçerli bir URL belirtin.');

                return message.reply({ embeds: [invalidURLEmbed], components: [invalidURLRow], ephemeral: true });
            }

            let user = await User.findOne({ discordId: message.author.id });

            if (!user) {
                user = await User.create({
                    discordId: message.author.id,
                    username: message.author.username,
                    discriminator: message.author.discriminator,
                    avatar: message.author.avatarURL({ dynamic: true }) || null,
                    premium: false,
                });

                message.reply('**:user: Kullanıcı Bilgileriniz Database Kaydedildi!**');
            }

            const isPremium = user.premium;

            const maxLinks = isPremium ? 10 : 3;

            const userLinksCount = await Uptime.countDocuments({ userId: message.author.id });

            if (userLinksCount >= maxLinks) {
                return message.reply(`Link ekleme sınırına ulaştınız. (Max: ${maxLinks})`);
            }

            let progress = 10;
            const waitMessage = await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#8CE0AA')
                        .setDescription(`** <:free:1202930398183559218>  Linkiniz Ekleniyor Lütfen Bekleyin %${progress}**`),
                ],
            });

            for (; progress <= 100; progress += 15) {
                await waitMessage.edit({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#8CE0AA')
                            .setDescription(`** <:free:1202930398183559218>  Linkiniz Ekleniyor Lütfen Bekleyin %${progress}**`),
                    ],
                });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            await Uptime.create({
                name: linkName,
                url: linkURL,
                userId: message.author.id,
                linkCount: 0,
            });

            const successEmbed = new MessageEmbed()
                .setColor('#A8E3BD')
                .setDescription('**<:free:1202930398183559218> Link Başarıyla Sisteme Eklendi:**', linkName, true);

            await waitMessage.edit({ embeds: [successEmbed] });

            const webhook = new WebhookClient({ url: 'https://discord.com/api/webhooks/1202930574982127616/Hiu2c0p412PR6P1rIIO4e8bCsFbqodVd_IahMME2gXXB0hzxnaTEHMmjNjXR78UPYWDt' });

            const logEmbed = new MessageEmbed()
                .setColor('#A8E3BD')
                .setDescription(`<:free:1202930398183559218> **${message.author.tag} Adlı Kullanıcı Sisteme Link Ekledi:**`, linkName, true)

            await webhook.send({ embeds: [logEmbed] });


            webhook.destroy();
        } catch (error) {
            console.error('Link eklenirken bir hata oluştu:', error);
            message.reply('Link eklenirken bir hata oluştu.');
        }
    },
};
