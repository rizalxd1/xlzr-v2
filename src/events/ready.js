const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(chalk.green(`🚀 ${client.user.tag} is online and ready!`));
        console.log(chalk.blue(`📊 Serving ${client.guilds.cache.size} servers`));
        console.log(chalk.blue(`👥 Serving ${client.users.cache.size} users`));
        
        client.user.setActivity('!help | Configurable Bot', { type: 'LISTENING' });
    },
};