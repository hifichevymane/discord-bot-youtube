import { Client, Collection } from "discord.js";

export default class DiscordClient extends Client {
  commands = new Collection();
};
