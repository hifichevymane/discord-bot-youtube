import { SlashCommandBuilder } from 'discord.js';
import { getVideoQueue } from '../../video-queue.js';

const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Shows the list of queued videos');

const execute = async (interaction) => {
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
};

export default { data, execute };
