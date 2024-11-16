import 'dotenv/config';

import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Command from './Command';

import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody
} from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'DISCORD_BOT_TOKEN';
const CLIENT_ID = process.env.CLIENT_ID || 'CLIENT_ID';

type JSONBody = RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody;

const deployCommands = async (): Promise<void> => {
  const commands: JSONBody[] = [];
  // Grab all the command folders from the commands directory you created earlier
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const commandFile = await import(filePath);
      const command: Command = new commandFile.default();
      commands.push(command.data.toJSON());
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(DISCORD_BOT_TOKEN);

  // and deploy your commands!
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    }) as { length: number };

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};

deployCommands();
