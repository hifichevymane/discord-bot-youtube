import { Client, Collection, GatewayIntentBits } from "discord.js";
import Command from "./Command";

class DiscordClient extends Client {
  commands = new Collection<string, Command>();
};

const intents: GatewayIntentBits[] = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
];
const client = new DiscordClient({ intents });

const getDiscordClient = (): DiscordClient => {
  return client;
}

export { DiscordClient, getDiscordClient };
