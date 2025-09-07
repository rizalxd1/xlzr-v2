const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Display bot commands and features',
        usage: '!help [command]',
        examples: ['!help', '!help setwelcome'],
        aliases: ['h', 'commands'],
        cooldown: 3
    },
    async execute(message, args) {
        const { commands } = message.client;
        const guildData = message.client.database.getGuild(message.guild.id);

        if (!args.length) {
            const embed = new EmbedBuilder()
                .setTitle('🤖 Bot Help & Commands')
                .setDescription('A powerful, configurable Discord bot with welcome messages, leveling, and moderation features.')
                .addFields(
                    {
                        name: '⚙️ Configuration Commands',
                        value: '`setwelcome` - Configure welcome messages\n`setgoodbye` - Configure goodbye messages\n`setleveling` - Configure auto-leveling\n`setwarnings` - Configure warning system',
                        inline: false
                    },
                    {
                        name: '🛡️ Moderation Commands',
                        value: '`warn` - Warn a user\n`warnings` - View user warnings\n`level` - Check user level',
                        inline: false
                    },
                    {
                        name: '📊 Current Settings',
                        value: `**Prefix:** \`${guildData.prefix}\`\n**Welcome:** ${guildData.welcome.enabled ? '✅' : '❌'}\n**Goodbye:** ${guildData.goodbye.enabled ? '✅' : '❌'}\n**Leveling:** ${guildData.leveling.enabled ? '✅' : '❌'}\n**Warnings:** ${guildData.warnings.enabled ? '✅' : '❌'}`,
                        inline: false
                    }
                )
                .setColor('#0099ff')
                .setFooter({ text: `Use ${guildData.prefix}help <command> for detailed command info` })
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        }

        const commandName = args[0].toLowerCase();
        const command = commands.get(commandName) || commands.find(c => c.data.aliases && c.data.aliases.includes(commandName));

        if (!command) {
            return message.reply('❌ That command doesn\'t exist!');
        }

        const embed = new EmbedBuilder()
            .setTitle(`📝 Command: ${command.data.name}`)
            .setDescription(command.data.description)
            .addFields(
                { name: 'Usage', value: command.data.usage || 'No usage info', inline: false },
                { name: 'Aliases', value: command.data.aliases?.join(', ') || 'None', inline: true },
                { name: 'Cooldown', value: `${command.data.cooldown || 3} seconds`, inline: true }
            )
            .setColor('#0099ff')
            .setTimestamp();

        if (command.data.examples) {
            embed.addFields({ name: 'Examples', value: command.data.examples.join('\n'), inline: false });
        }

        message.reply({ embeds: [embed] });
    },
};