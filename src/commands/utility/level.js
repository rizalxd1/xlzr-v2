const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'level',
        description: 'Check your or another user\'s level and XP',
        usage: '!level [user]',
        examples: ['!level', '!level @user'],
        aliases: ['rank', 'xp'],
        cooldown: 3
    },
    async execute(message, args) {
        let targetUser = message.author;

        if (args.length > 0) {
            const userMention = args[0];
            const userId = userMention.replace(/[<>@!]/g, '');
            const member = await message.guild.members.fetch(userId).catch(() => null);
            
            if (member) {
                targetUser = member.user;
            }
        }

        const userData = message.client.database.getUser(targetUser.id, message.guild.id);
        const xpForNextLevel = userData.level * 1000;
        const progressPercentage = Math.floor((userData.xp / xpForNextLevel) * 100);
        const progressBar = createProgressBar(progressPercentage);

        const embed = new EmbedBuilder()
            .setTitle('📈 Level & XP Info')
            .setDescription(`**User:** ${targetUser.tag}`)
            .addFields(
                { name: '🎯 Level', value: userData.level.toString(), inline: true },
                { name: '⭐ Current XP', value: userData.xp.toString(), inline: true },
                { name: '🎪 XP to Next Level', value: (xpForNextLevel - userData.xp).toString(), inline: true },
                { name: '📊 Progress', value: `${progressBar} ${progressPercentage}%`, inline: false }
            )
            .setColor('#ffff00')
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};

function createProgressBar(percentage) {
    const totalBars = 10;
    const filledBars = Math.floor((percentage / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    
    return '█'.repeat(filledBars) + '░'.repeat(emptyBars);
}