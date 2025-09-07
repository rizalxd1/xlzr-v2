const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'setwarnings',
        description: 'Configure the auto-warning system',
        usage: '!setwarnings <enable|disable> [logChannel] [options]',
        examples: [
            '!setwarnings enable #mod-logs',
            '!setwarnings enable #logs autokick=3 autoban=5',
            '!setwarnings disable'
        ],
        aliases: ['warnings', 'automod'],
        cooldown: 3
    },
    async execute(message, args) {
        if (!message.member.permissions.has('ManageGuild')) {
            return message.reply('❌ You need the `Manage Server` permission to use this command.');
        }

        if (args.length === 0) {
            return message.reply('❌ Please specify `enable` or `disable`. Usage: `!setwarnings <enable|disable> [logChannel] [options]`');
        }

        const guildData = message.client.database.getGuild(message.guild.id);
        const action = args[0].toLowerCase();

        if (action === 'disable') {
            guildData.warnings.enabled = false;
            message.client.database.updateGuild(message.guild.id, guildData);
            
            return message.reply('✅ Auto-warning system has been **disabled**.');
        }

        if (action === 'enable') {
            if (args.length < 2) {
                return message.reply('❌ Please provide a log channel for warning notifications.');
            }

            const channelMention = args[1];
            const channelId = channelMention.replace(/[<>#]/g, '');
            const channel = message.guild.channels.cache.get(channelId);

            if (!channel) {
                return message.reply('❌ Invalid channel provided.');
            }

            // Parse optional parameters
            const options = parseOptions(args.slice(2).join(' '));
            
            guildData.warnings.enabled = true;
            guildData.warnings.logChannel = channel.id;
            
            if (options.autokick) {
                const kickCount = parseInt(options.autokick);
                if (kickCount > 0 && kickCount <= 10) {
                    guildData.warnings.autoKick = kickCount;
                }
            }
            
            if (options.autoban) {
                const banCount = parseInt(options.autoban);
                if (banCount > 0 && banCount <= 15) {
                    guildData.warnings.autoBan = banCount;
                }
            }

            message.client.database.updateGuild(message.guild.id, guildData);

            const embed = new EmbedBuilder()
                .setTitle('✅ Auto-Warning System Configured')
                .setDescription(`Warning logs will be sent to ${channel}`)
                .addFields(
                    { name: 'Auto-kick at', value: `${guildData.warnings.autoKick} warnings`, inline: true },
                    { name: 'Auto-ban at', value: `${guildData.warnings.autoBan} warnings`, inline: true }
                )
                .setColor('#ff6b00')
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        message.reply('❌ Invalid action. Use `enable` or `disable`.');
    },
};

function parseOptions(optionsString) {
    const options = {};
    const patterns = {
        autokick: /autokick=(\d+)/,
        autoban: /autoban=(\d+)/
    };

    for (const [key, pattern] of Object.entries(patterns)) {
        const match = optionsString.match(pattern);
        if (match) {
            options[key] = match[1];
        }
    }

    return options;
}