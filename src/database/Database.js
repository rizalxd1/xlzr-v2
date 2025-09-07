const fs = require('fs-extra');
const path = require('path');

class Database {
    constructor() {
        this.dataPath = path.join(__dirname, '..', '..', 'data');
        this.guildsFile = path.join(this.dataPath, 'guilds.json');
        this.usersFile = path.join(this.dataPath, 'users.json');
        this.guilds = new Map();
        this.users = new Map();
    }

    async init() {
        await fs.ensureDir(this.dataPath);
        
        // Load guilds data
        if (await fs.pathExists(this.guildsFile)) {
            const guildsData = await fs.readJson(this.guildsFile);
            this.guilds = new Map(Object.entries(guildsData));
        }

        // Load users data
        if (await fs.pathExists(this.usersFile)) {
            const usersData = await fs.readJson(this.usersFile);
            this.users = new Map(Object.entries(usersData));
        }

        // Auto-save every 5 minutes
        setInterval(() => this.save(), 5 * 60 * 1000);
    }

    async save() {
        await fs.writeJson(this.guildsFile, Object.fromEntries(this.guilds));
        await fs.writeJson(this.usersFile, Object.fromEntries(this.users));
    }

    getGuild(guildId) {
        if (!this.guilds.has(guildId)) {
            this.guilds.set(guildId, {
                id: guildId,
                prefix: '!',
                welcome: {
                    enabled: false,
                    channel: null,
                    message: 'Welcome {mention} to {server}!',
                    color: '#00ff00',
                    gif: null,
                    thumbnail: null
                },
                goodbye: {
                    enabled: false,
                    channel: null,
                    message: '{user} has left {server}.',
                    color: '#ff0000',
                    gif: null,
                    thumbnail: null
                },
                leveling: {
                    enabled: false,
                    channel: null,
                    message: 'Congratulations {mention}! You reached level {level}!',
                    color: '#ffff00'
                },
                warnings: {
                    enabled: false,
                    autoKick: 3,
                    autoBan: 5,
                    logChannel: null
                }
            });
        }
        return this.guilds.get(guildId);
    }

    getUser(userId, guildId) {
        const key = `${userId}_${guildId}`;
        if (!this.users.has(key)) {
            this.users.set(key, {
                userId,
                guildId,
                xp: 0,
                level: 1,
                warnings: [],
                lastMessage: 0
            });
        }
        return this.users.get(key);
    }

    updateGuild(guildId, data) {
        const guild = this.getGuild(guildId);
        Object.assign(guild, data);
        this.guilds.set(guildId, guild);
    }

    updateUser(userId, guildId, data) {
        const key = `${userId}_${guildId}`;
        const user = this.getUser(userId, guildId);
        Object.assign(user, data);
        this.users.set(key, user);
    }
}

module.exports = Database;