import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVideoQueue } from '../../video-queue';
import Command from '../../Command';

export default class QueueCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the list of queued videos');

  public async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
    const trackQueue = getVideoQueue();
    if (!trackQueue.length) {
      await interaction.reply('The queue is empty!');
      return;
    }
    const listedTrackQueueItems = trackQueue
      .map((value, index) => `${index + 1}. ${value}`)
      .join('\n');

    const listString = `
      Current queue:
      ${listedTrackQueueItems}
    `;
    await interaction.reply(listString);
  }
}