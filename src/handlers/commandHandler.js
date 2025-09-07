const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function loadCommands(client) {
    const commandsPath = path.join(__dirname, '..', 'commands');
    
    if (!await fs.pathExists(commandsPath)) {
        await fs.ensureDir(commandsPath);
    }

    const commandFolders = await fs.readdir(commandsPath);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        const stat = await fs.stat(folderPath);
        
        if (stat.isDirectory()) {
            const commandFiles = (await fs.readdir(folderPath)).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    console.log(chalk.cyan(`📝 Loaded command: ${command.data.name}`));
                } else {
                    console.log(chalk.yellow(`⚠️  Command at ${filePath} is missing required "data" or "execute" property`));
                }
            }
        }
    }
}

module.exports = { loadCommands };