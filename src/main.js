import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`The client is ready! Logged in as ${readyClient.user.tag}`);
});

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'token';
client.login(DISCORD_BOT_TOKEN);
