const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'warn',
        description: 'Warn a user',
        usage: '!warn <user> <reason>',
        examples: ['!warn @user Spamming messages', '!warn 123456789012345678 Breaking rules'],
        cooldown: 3
    },
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply('❌ You need the `Moderate Members` permission to use this command.');
        }

        if (args.length < 2) {
            return message.reply('❌ Please provide a user and reason. Usage: `!warn <user> <reason>`');
        }

        const userMention = args[0];
        const userId = userMention.replace(/[<>@!]/g, '');
        const member = await message.guild.members.fetch(userId).catch(() => null);

        if (!member) {
            return message.reply('❌ User not found in this server.');
        }

        if (member.id === message.author.id) {
            return message.reply('❌ You cannot warn yourself.');
        }

        if (member.permissions.has('Administrator')) {
            return message.reply('❌ You cannot warn administrators.');
        }

        const reason = args.slice(1).join(' ');
        const guildData = message.client.database.getGuild(message.guild.id);
        const userData = message.client.database.getUser(member.id, message.guild.id);

        // Add warning
        const warning = {
            id: Date.now(),
            reason,
            moderator: message.author.id,
            timestamp: Date.now()
        };

        userData.warnings.push(warning);
        message.client.database.updateUser(member.id, message.guild.id, userData);

        const warningEmbed = new EmbedBuilder()
            .setTitle('⚠️ User Warned')
            .setDescription(`**User:** ${member.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author.tag}`)
            .addFields(
                { name: 'Total Warnings', value: userData.warnings.length.toString(), inline: true },
                { name: 'Warning ID', value: warning.id.toString(), inline: true }
            )
            .setColor('#ff6b00')
            .setTimestamp();

        message.reply({ embeds: [warningEmbed] });

        // Log to warning channel
        if (guildData.warnings.enabled && guildData.warnings.logChannel) {
            const logChannel = message.guild.channels.cache.get(guildData.warnings.logChannel);
            if (logChannel) {
                logChannel.send({ embeds: [warningEmbed] });
            }
        }

        // Auto-moderation actions
        if (guildData.warnings.enabled) {
            if (userData.warnings.length >= guildData.warnings.autoBan) {
                try {
                    await member.ban({ reason: `Auto-ban: ${guildData.warnings.autoBan} warnings reached` });
                    message.channel.send(`🔨 **${member.user.tag}** has been auto-banned for reaching ${guildData.warnings.autoBan} warnings.`);
                } catch (error) {
                    console.error('Auto-ban failed:', error);
                }
            } else if (userData.warnings.length >= guildData.warnings.autoKick) {
                try {
                    await member.kick(`Auto-kick: ${guildData.warnings.autoKick} warnings reached`);
                    message.channel.send(`👢 **${member.user.tag}** has been auto-kicked for reaching ${guildData.warnings.autoKick} warnings.`);
                } catch (error) {
                    console.error('Auto-kick failed:', error);
                }
            }
        }
    },
};