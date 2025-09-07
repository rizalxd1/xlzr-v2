const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function loadEvents(client) {
    const eventsPath = path.join(__dirname, '..', 'events');
    
    if (!await fs.pathExists(eventsPath)) {
        await fs.ensureDir(eventsPath);
    }

    const eventFiles = (await fs.readdir(eventsPath)).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        
        console.log(chalk.magenta(`🎯 Loaded event: ${event.name}`));
    }
}

module.exports = { loadEvents };