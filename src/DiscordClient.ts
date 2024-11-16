import { Client, Collection } from "discord.js";
import Command from "./Command";

export default class DiscordClient extends Client {
  commands = new Collection<string, Command>();
};
