import { SlashCommandBuilder } from 'discord.js';
import { getTrackQueue } from '../../track-queue.js';

const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('Shows the list of queued tracks');

const execute = async (interaction) => {
  const trackQueue = getTrackQueue();
  if (!trackQueue.length) {
    await interaction.reply('The queue is empty!');
    return;
  }
  const listedTrackQueueItems = trackQueue
    .map((value, index) => `${index + 1}. ${value}`)
    .join('\n');

  const listString = `
    Current track list:
    ${listedTrackQueueItems}
  `;
  await interaction.reply(listString);
};

export { data, execute };
