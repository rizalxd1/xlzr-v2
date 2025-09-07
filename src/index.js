const { Client, GatewayIntentBits, Collection } = require('discord.js');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const Database = require('./database/Database');

class DiscordBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildPresences
            ]
        });

        this.client.commands = new Collection();
        this.client.cooldowns = new Collection();
        this.database = new Database();
        this.client.database = this.database;
    }

    async initialize() {
        try {
            console.log(chalk.blue('🤖 Initializing Discord Bot...'));
            
            // Initialize database
            await this.database.init();
            console.log(chalk.green('✅ Database initialized'));

            // Load commands and events
            await loadCommands(this.client);
            await loadEvents(this.client);

            // Get token
            const token = await this.getToken();
            
            // Login
            await this.client.login(token);
            
        } catch (error) {
            console.error(chalk.red('❌ Failed to initialize bot:'), error);
            process.exit(1);
        }
    }

    async getToken() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question(chalk.yellow('🔑 Please enter your Discord bot token: '), (token) => {
                rl.close();
                if (!token.trim()) {
                    console.log(chalk.red('❌ No token provided!'));
                    process.exit(1);
                }
                resolve(token.trim());
            });
        });
    }
}

// Start the bot
const bot = new DiscordBot();
bot.initialize();