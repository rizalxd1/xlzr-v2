const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'setwelcome',
        description: 'Configure welcome messages with optional parameters',
        usage: '!setwelcome <channel> [options]',
        examples: [
            '!setwelcome #general',
            '!setwelcome #welcome color=#ff0000 message="Welcome {mention} to our server!"',
            '!setwelcome #welcome gif="https://example.com/welcome.gif" thumbnail=avatar'
        ],
        aliases: ['welcome'],
        cooldown: 3
    },
    async execute(message, args) {
        if (!message.member.permissions.has('ManageGuild')) {
            return message.reply('❌ You need the `Manage Server` permission to use this command.');
        }

        if (args.length === 0) {
            return message.reply('❌ Please provide a channel. Usage: `!setwelcome <channel> [options]`');
        }

        const guildData = message.client.database.getGuild(message.guild.id);
        const channelMention = args[0];
        const channelId = channelMention.replace(/[<>#]/g, '');
        const channel = message.guild.channels.cache.get(channelId);

        if (!channel) {
            return message.reply('❌ Invalid channel provided.');
        }

        // Parse optional parameters
        const options = parseOptions(args.slice(1).join(' '));
        
        // Update welcome configuration
        guildData.welcome.enabled = true;
        guildData.welcome.channel = channel.id;
        
        if (options.message) {
            guildData.welcome.message = options.message;
        }
        
        if (options.color && /^#[0-9A-F]{6}$/i.test(options.color)) {
            guildData.welcome.color = options.color;
        }
        
        if (options.gif) {
            guildData.welcome.gif = options.gif;
        }
        
        if (options.thumbnail) {
            if (['avatar', 'server', 'none'].includes(options.thumbnail)) {
                guildData.welcome.thumbnail = options.thumbnail === 'none' ? null : options.thumbnail;
            }
        }

        message.client.database.updateGuild(message.guild.id, guildData);

        const embed = new EmbedBuilder()
            .setTitle('✅ Welcome Message Configured')
            .setDescription(`Welcome messages will be sent to ${channel}`)
            .addFields(
                { name: 'Message', value: guildData.welcome.message, inline: false },
                { name: 'Color', value: guildData.welcome.color, inline: true },
                { name: 'Thumbnail', value: guildData.welcome.thumbnail || 'None', inline: true },
                { name: 'GIF', value: guildData.welcome.gif ? '✅ Set' : '❌ None', inline: true }
            )
            .setColor(guildData.welcome.color)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};

function parseOptions(optionsString) {
    const options = {};
    const patterns = {
        color: /color=([#]?[0-9A-Fa-f]{6})/,
        message: /message="([^"]+)"/,
        gif: /gif="([^"]+)"/,
        thumbnail: /thumbnail=(\w+)/
    };

    for (const [key, pattern] of Object.entries(patterns)) {
        const match = optionsString.match(pattern);
        if (match) {
            options[key] = key === 'color' && !match[1].startsWith('#') ? `#${match[1]}` : match[1];
        }
    }

    return options;
}