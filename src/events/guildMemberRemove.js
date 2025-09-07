const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    execute(member) {
        const guildData = member.client.database.getGuild(member.guild.id);
        
        if (!guildData.goodbye.enabled || !guildData.goodbye.channel) return;
        
        const channel = member.guild.channels.cache.get(guildData.goodbye.channel);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle('👋 Goodbye!')
            .setDescription(guildData.goodbye.message
                .replace('{mention}', `<@${member.id}>`)
                .replace('{user}', member.user.username)
                .replace('{server}', member.guild.name))
            .setColor(guildData.goodbye.color)
            .setTimestamp();

        if (guildData.goodbye.thumbnail === 'avatar') {
            embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
        } else if (guildData.goodbye.thumbnail === 'server') {
            embed.setThumbnail(member.guild.iconURL({ dynamic: true }));
        }

        if (guildData.goodbye.gif) {
            embed.setImage(guildData.goodbye.gif);
        }

        channel.send({ embeds: [embed] });
    },
};