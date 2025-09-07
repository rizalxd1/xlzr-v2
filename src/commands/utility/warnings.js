const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'warnings',
        description: 'View warnings for a user',
        usage: '!warnings <user>',
        examples: ['!warnings @user', '!warnings 123456789012345678'],
        aliases: ['warns'],
        cooldown: 3
    },
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply('❌ You need the `Moderate Members` permission to use this command.');
        }

        if (args.length === 0) {
            return message.reply('❌ Please provide a user. Usage: `!warnings <user>`');
        }

        const userMention = args[0];
        const userId = userMention.replace(/[<>@!]/g, '');
        const member = await message.guild.members.fetch(userId).catch(() => null);

        if (!member) {
            return message.reply('❌ User not found in this server.');
        }

        const userData = message.client.database.getUser(member.id, message.guild.id);

        if (userData.warnings.length === 0) {
            return message.reply(`✅ **${member.user.tag}** has no warnings.`);
        }

        const embed = new EmbedBuilder()
            .setTitle(`⚠️ Warnings for ${member.user.tag}`)
            .setDescription(`Total warnings: **${userData.warnings.length}**`)
            .setColor('#ff6b00')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const warnings = userData.warnings.slice(-5); // Show last 5 warnings
        
        warnings.forEach((warning, index) => {
            const moderator = message.guild.members.cache.get(warning.moderator);
            const date = new Date(warning.timestamp).toLocaleDateString();
            
            embed.addFields({
                name: `Warning #${userData.warnings.length - warnings.length + index + 1}`,
                value: `**Reason:** ${warning.reason}\n**Moderator:** ${moderator?.user.tag || 'Unknown'}\n**Date:** ${date}`,
                inline: false
            });
        });

        if (userData.warnings.length > 5) {
            embed.setFooter({ text: `Showing last 5 of ${userData.warnings.length} warnings` });
        }

        message.reply({ embeds: [embed] });
    },
};