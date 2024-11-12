import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GatewayIntentBits } from 'discord.js';
import DiscordClient from './DiscordClient';
import Command from './Command';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'token';

const main = async () => {
  const client = new DiscordClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
    ],
  });

  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts'));

    try {
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command: { default: Command } = await import(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        client.commands.set(command.default.data.name, command.default);
      }
    } catch (err) {
      console.error('Failed to load the file with a command: ', err);
    }
  }

  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.ts'));

  try {
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = await import(filePath);
      const { name, once, execute } = event.default;
      if (once) {
        client.once(name, (...args) => execute(...args));
      } else {
        client.on(name, (...args) => execute(...args));
      }
    }
  } catch (err) {
    console.error('Failed to load a file with bot event: ', err);
  }

  client.login(DISCORD_BOT_TOKEN);
};

main();
