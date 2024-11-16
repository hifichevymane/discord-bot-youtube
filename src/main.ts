import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GatewayIntentBits } from 'discord.js';

import DiscordClient from './DiscordClient';
import Command from './Command';
import { IClientEvent } from './ClientEvent';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'token';

const main = async () => {
  const intents: GatewayIntentBits[] = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ];
  const client = new DiscordClient({ intents });

  // The current file extension of the file(for tsc build)
  const fileExtension = path.extname(__filename);

  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(fileExtension));

    try {
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const commandFile = await import(filePath);
        const command: Command = new commandFile.default();
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        client.commands.set(command.data.name, command);
      }
    } catch (err) {
      console.error('Failed to load the file with a command: ', err);
    }
  }

  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(fileExtension));
  try {
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const eventFile = await import(filePath);
      const event: IClientEvent = new eventFile.default(client);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  } catch (err) {
    console.error('Failed to load a file with bot event: ', err);
  }

  client.login(DISCORD_BOT_TOKEN);
};

main();
