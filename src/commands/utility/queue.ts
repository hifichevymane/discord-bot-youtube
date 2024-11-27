import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Command from '../../Command';
import getAudioPlayer from '../../audio-player';

export default class QueueCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the list of queued videos');

  public async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
    const player = getAudioPlayer();
    const trackQueue = player.getVideoQueue();
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
