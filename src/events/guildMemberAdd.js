const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const guildData = member.client.database.getGuild(member.guild.id);
        
        if (!guildData.welcome.enabled || !guildData.welcome.channel) return;
        
        const channel = member.guild.channels.cache.get(guildData.welcome.channel);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle('👋 Welcome!')
            .setDescription(guildData.welcome.message
                .replace('{mention}', `<@${member.id}>`)
                .replace('{user}', member.user.username)
                .replace('{server}', member.guild.name))
            .setColor(guildData.welcome.color)
            .setTimestamp();

        if (guildData.welcome.thumbnail === 'avatar') {
            embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
        } else if (guildData.welcome.thumbnail === 'server') {
            embed.setThumbnail(member.guild.iconURL({ dynamic: true }));
        }

        if (guildData.welcome.gif) {
            embed.setImage(guildData.welcome.gif);
        }

        channel.send({ embeds: [embed] });
    },
};