import { Client, Events } from 'discord.js';
import { ClientEvent } from '../ClientEvent';

export default class ClientReadyEvent extends ClientEvent<Events.ClientReady> {
  public readonly name = Events.ClientReady;
  public readonly once = true;
  public execute(client: Client<true>): void | Promise<void> {
    console.log(`The client is ready! Logged in as ${client.user.tag}`);
  }
}
