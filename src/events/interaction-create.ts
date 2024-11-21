import { Events, Interaction } from 'discord.js';
import { ClientEvent } from '../ClientEvent';

export default class InteractionCreateEvent extends ClientEvent<Events.InteractionCreate> {
  public readonly name = Events.InteractionCreate;
  public readonly once = false;
  public async execute(interaction: Interaction<'cached'>): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  }
}
