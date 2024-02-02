const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Uptime = require('./models/Uptime');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ],
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`Bot ${client.user.tag} olarak başlatıldı!`);
});

client.on('messageCreate', (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('Bir hata oluştu!');
  }
});

client.on('guildMemberRemove', async (member) => {
  try {
    const user = await User.findOne({ discordId: member.id });

    if (user) {
      await Uptime.deleteMany({ userId: member.id });

      await User.deleteOne({ discordId: member.id });

      console.log(`Sunucudan ayrılan kullanıcı (${member.user.tag})'a ait bütün linkler, panel verileri ve kayıtlar silindi.`);
    }
  } catch (error) {
    console.error('Sunucudan ayrılan kullanıcıya ait link, panel verisi ve kayıtları silerken bir hata oluştu:', error);
  }
});

client.login(process.env.TOKEN);
