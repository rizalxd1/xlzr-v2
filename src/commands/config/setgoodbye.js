const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'setgoodbye',
        description: 'Configure goodbye messages with optional parameters',
        usage: '!setgoodbye <channel> [options]',
        examples: [
            '!setgoodbye #general',
            '!setgoodbye #goodbye color=#ff0000 message="Goodbye {user}!"',
            '!setgoodbye #goodbye gif="https://example.com/goodbye.gif" thumbnail=server'
        ],
        aliases: ['goodbye'],
        cooldown: 3
    },
    async execute(message, args) {
        if (!message.member.permissions.has('ManageGuild')) {
            return message.reply('❌ You need the `Manage Server` permission to use this command.');
        }

        if (args.length === 0) {
            return message.reply('❌ Please provide a channel. Usage: `!setgoodbye <channel> [options]`');
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
        
        // Update goodbye configuration
        guildData.goodbye.enabled = true;
        guildData.goodbye.channel = channel.id;
        
        if (options.message) {
            guildData.goodbye.message = options.message;
        }
        
        if (options.color && /^#[0-9A-F]{6}$/i.test(options.color)) {
            guildData.goodbye.color = options.color;
        }
        
        if (options.gif) {
            guildData.goodbye.gif = options.gif;
        }
        
        if (options.thumbnail) {
            if (['avatar', 'server', 'none'].includes(options.thumbnail)) {
                guildData.goodbye.thumbnail = options.thumbnail === 'none' ? null : options.thumbnail;
            }
        }

        message.client.database.updateGuild(message.guild.id, guildData);

        const embed = new EmbedBuilder()
            .setTitle('✅ Goodbye Message Configured')
            .setDescription(`Goodbye messages will be sent to ${channel}`)
            .addFields(
                { name: 'Message', value: guildData.goodbye.message, inline: false },
                { name: 'Color', value: guildData.goodbye.color, inline: true },
                { name: 'Thumbnail', value: guildData.goodbye.thumbnail || 'None', inline: true },
                { name: 'GIF', value: guildData.goodbye.gif ? '✅ Set' : '❌ None', inline: true }
            )
            .setColor(guildData.goodbye.color)
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