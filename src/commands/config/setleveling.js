const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'setleveling',
        description: 'Configure the auto-leveling system',
        usage: '!setleveling <enable|disable> [channel] [options]',
        examples: [
            '!setleveling enable #level-ups',
            '!setleveling enable #general color=#ffff00 message="GG {mention}! Level {level}!"',
            '!setleveling disable'
        ],
        aliases: ['leveling', 'levels'],
        cooldown: 3
    },
    async execute(message, args) {
        if (!message.member.permissions.has('ManageGuild')) {
            return message.reply('❌ You need the `Manage Server` permission to use this command.');
        }

        if (args.length === 0) {
            return message.reply('❌ Please specify `enable` or `disable`. Usage: `!setleveling <enable|disable> [channel] [options]`');
        }

        const guildData = message.client.database.getGuild(message.guild.id);
        const action = args[0].toLowerCase();

        if (action === 'disable') {
            guildData.leveling.enabled = false;
            message.client.database.updateGuild(message.guild.id, guildData);
            
            return message.reply('✅ Auto-leveling system has been **disabled**.');
        }

        if (action === 'enable') {
            if (args.length < 2) {
                return message.reply('❌ Please provide a channel for level-up announcements.');
            }

            const channelMention = args[1];
            const channelId = channelMention.replace(/[<>#]/g, '');
            const channel = message.guild.channels.cache.get(channelId);

            if (!channel) {
                return message.reply('❌ Invalid channel provided.');
            }

            // Parse optional parameters
            const options = parseOptions(args.slice(2).join(' '));
            
            guildData.leveling.enabled = true;
            guildData.leveling.channel = channel.id;
            
            if (options.message) {
                guildData.leveling.message = options.message;
            }
            
            if (options.color && /^#[0-9A-F]{6}$/i.test(options.color)) {
                guildData.leveling.color = options.color;
            }

            message.client.database.updateGuild(message.guild.id, guildData);

            const embed = new EmbedBuilder()
                .setTitle('✅ Auto-Leveling System Configured')
                .setDescription(`Level-up announcements will be sent to ${channel}`)
                .addFields(
                    { name: 'Message', value: guildData.leveling.message, inline: false },
                    { name: 'Color', value: guildData.leveling.color, inline: true }
                )
                .setColor(guildData.leveling.color)
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        message.reply('❌ Invalid action. Use `enable` or `disable`.');
    },
};

function parseOptions(optionsString) {
    const options = {};
    const patterns = {
        color: /color=([#]?[0-9A-Fa-f]{6})/,
        message: /message="([^"]+)"/
    };

    for (const [key, pattern] of Object.entries(patterns)) {
        const match = optionsString.match(pattern);
        if (match) {
            options[key] = key === 'color' && !match[1].startsWith('#') ? `#${match[1]}` : match[1];
        }
    }

    return options;
}