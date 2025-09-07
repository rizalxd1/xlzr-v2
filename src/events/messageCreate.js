const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot) return;

        const client = message.client;
        const guildData = client.database.getGuild(message.guild.id);
        
        // Handle commands
        if (message.content.startsWith(guildData.prefix)) {
            handleCommand(message, client, guildData);
        }

        // Handle leveling
        if (guildData.leveling.enabled) {
            handleLeveling(message, client);
        }
    },
};

async function handleCommand(message, client, guildData) {
    const args = message.content.slice(guildData.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || 
                   client.commands.find(cmd => cmd.data.aliases && cmd.data.aliases.includes(commandName));

    if (!command) return;

    // Cooldown handling
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Map());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.data.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        await message.reply('There was an error executing this command!');
    }
}

function handleLeveling(message, client) {
    const userData = client.database.getUser(message.author.id, message.guild.id);
    const guildData = client.database.getGuild(message.guild.id);
    
    // Prevent spam (1 minute cooldown)
    if (Date.now() - userData.lastMessage < 60000) return;
    
    userData.lastMessage = Date.now();
    userData.xp += Math.floor(Math.random() * 25) + 15;
    
    const xpForNextLevel = userData.level * 1000;
    
    if (userData.xp >= xpForNextLevel) {
        userData.level++;
        userData.xp = userData.xp - xpForNextLevel;
        
        const levelUpEmbed = new EmbedBuilder()
            .setTitle('🎉 Level Up!')
            .setDescription(guildData.leveling.message
                .replace('{mention}', `<@${message.author.id}>`)
                .replace('{user}', message.author.username)
                .replace('{level}', userData.level)
                .replace('{server}', message.guild.name))
            .setColor(guildData.leveling.color)
            .setTimestamp();
            
        const channel = guildData.leveling.channel ? 
                       message.guild.channels.cache.get(guildData.leveling.channel) : 
                       message.channel;
                       
        if (channel) {
            channel.send({ embeds: [levelUpEmbed] });
        }
    }
    
    client.database.updateUser(message.author.id, message.guild.id, userData);
}