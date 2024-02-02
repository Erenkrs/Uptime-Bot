const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Pong!',
    execute(message, args, client) {
        const pingEmbed = {
            color: 0x3498db,
            description: `**<:ping:1203004775302430751>  Uptime Botunun Pingi ${Math.round(client.ws.ping)}ms**`,
        };

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('deleteButton')
                    .setLabel('Sil')
                    .setStyle('DANGER'),
            );

        message.reply({ embeds: [pingEmbed], components: [row] }).then((sentMessage) => {
            const filter = (interaction) => {
                interaction.deferUpdate();
                return interaction.customId === 'deleteButton' && interaction.user.id === message.author.id;
            };

            const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 }); // 15 seconds timeout

            collector.on('collect', () => {
                sentMessage.delete();
                message.delete(); // Kullanıcının orijinal mesajını da sil
                collector.stop();
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    sentMessage.edit({ components: [] });
                }
            });
        });
    },
};