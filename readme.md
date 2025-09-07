# Configurable Discord Bot - xlzr

A powerful, feature-rich Discord bot with configurable welcome messages, auto-leveling system, and comprehensive moderation tools. Built with Discord.js v14 and designed for easy customization.

## 🌟 Features

### 📋 Core Features
- **Welcome Messages**: Customizable embeds with colors, GIFs, and thumbnails
- **Goodbye Messages**: Personalized farewell messages
- **Auto-Leveling**: XP-based leveling system with announcements
- **Warning System**: Automated moderation with auto-kick and auto-ban
- **Configurable Commands**: Extensive customization options

### 🎨 Customization Options
- **Colors**: Hex color codes for embed styling
- **Messages**: Custom text with placeholder variables
- **GIFs**: Add animated images to embeds
- **Thumbnails**: Avatar or server icon options
- **Channels**: Designate specific channels for different features

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- A Discord bot token ([Create one here](https://discord.com/developers/applications))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rizalxd1/xlzr-v2
cd xlzr-v2
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the bot**
```bash
npm start
```

4. **Enter your bot token when prompted**

The bot will automatically handle database initialization and start listening for commands.

## 📚 Commands

### ⚙️ Configuration Commands

#### Welcome Messages
```bash
!setwelcome <channel> [options]
```

**Options:**
- `color=#hexcode` - Set embed color (e.g., `color=#ff0000`)
- `message="text"` - Custom welcome message
- `gif="url"` - Add animated GIF
- `thumbnail=avatar|server|none` - Set thumbnail type

**Examples:**
```bash
!setwelcome #general
!setwelcome #welcome color=#00ff00 message="Welcome {mention} to {server}!"
!setwelcome #welcome gif="https://example.com/welcome.gif" thumbnail=avatar
```

#### Goodbye Messages
```bash
!setgoodbye <channel> [options]
```

**Options:**
- `color=#hexcode` - Set embed color
- `message="text"` - Custom goodbye message
- `gif="url"` - Add animated GIF
- `thumbnail=avatar|server|none` - Set thumbnail type

#### Auto-Leveling
```bash
!setleveling <enable|disable> [channel] [options]
```

**Options:**
- `color=#hexcode` - Set level-up announcement color
- `message="text"` - Custom level-up message

**Examples:**
```bash
!setleveling enable #level-ups
!setleveling enable #general color=#ffff00 message="GG {mention}! Level {level}!"
!setleveling disable
```

#### Warning System
```bash
!setwarnings <enable|disable> [logChannel] [options]
```

**Options:**
- `autokick=number` - Auto-kick after X warnings (1-10)
- `autoban=number` - Auto-ban after X warnings (1-15)

**Examples:**
```bash
!setwarnings enable #mod-logs
!setwarnings enable #logs autokick=3 autoban=5
!setwarnings disable
```

### 🛡️ Moderation Commands

#### Warn Users
```bash
!warn <user> <reason>
```

#### View Warnings
```bash
!warnings <user>
```

### 📊 Utility Commands

#### Check Level/XP
```bash
!level [user]
```

#### Help
```bash
!help [command]
```

## 🔧 Configuration

### Message Placeholders
Use these placeholders in custom messages:

- `{mention}` - Mention the user (@user)
- `{user}` - Username without mention
- `{server}` - Server name
- `{level}` - User's current level (leveling only)

### Database
The bot uses a JSON-based database system that automatically saves:
- Guild configurations
- User XP and levels
- Warning records

Data is stored in the `data/` directory and auto-saves every 5 minutes.

### Permissions
Commands require appropriate Discord permissions:
- **Configuration commands**: `Manage Server`
- **Moderation commands**: `Moderate Members`
- **Auto-kick/ban**: `Kick Members` / `Ban Members`

## 🎨 Design Examples

### Welcome Message Setup
```bash
# Basic setup
!setwelcome #welcome

# Advanced setup with styling
!setwelcome #welcome color=#7289da message="🎉 Welcome {mention} to **{server}**! We're glad you're here!" gif="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif" thumbnail=avatar
```

### Leveling System
```bash
# Enable with custom styling
!setleveling enable #level-ups color=#ffd700 message="🎉 Congratulations {mention}! You've reached **Level {level}**! Keep it up! 🚀"
```

## 📁 Project Structure
```
configurable-discord-bot/
├── src/
│   ├── commands/
│   │   ├── config/          # Configuration commands
│   │   ├── moderation/      # Moderation commands
│   │   └── utility/         # Utility commands
│   ├── events/              # Discord event handlers
│   ├── handlers/            # Command and event loading
│   ├── database/            # Database management
│   └── index.js             # Main entry point
├── data/                    # Database files (auto-created)
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues]([https://github.com/rizalxd1/xlzr-v2/issues]()) page
2. Create a new issue with detailed information
3. Join our support server: [Discord Invite Link]

## 🔮 Upcoming Features

- [ ] Custom reaction roles
- [ ] Advanced moderation tools
- [ ] Music commands
- [ ] Economy system
- [ ] Custom command creation
- [ ] Web dashboard
- [ ] Multiple language support

---


⭐ **Star this repository if you found it helpful!**
