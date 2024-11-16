import { ClientEvents } from "discord.js"
import DiscordClient from "./DiscordClient";

abstract class ClientEvent<T extends keyof ClientEvents> {
  public abstract readonly name: T;

  public abstract readonly once: boolean;

  public abstract execute(...args: ClientEvents[T]): void | Promise<void>;

  protected client: DiscordClient;

  constructor(client: DiscordClient) {
    this.client = client;
  }
}

interface IClientEvent {
  name: string,
  once: boolean,
  execute: (...args: any) => void | Promise<void>
}

export { ClientEvent, IClientEvent };
