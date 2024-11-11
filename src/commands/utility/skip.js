import { SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import { getNextTrack, getTrackQueue } from '../../track-queue.js';
import player from '../../audio-player.js';
import { createAudioResourceFromYouTubeURL } from '../../utils.js';

const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skips the current track');

const execute = async (interaction) => {
  if (player.state.status !== AudioPlayerStatus.Playing) {
    await interaction.reply("There's no playing tracks!");
    return;
  }

  player.stop();
  const nextTrackUrl = getNextTrack();
  await interaction.reply('The current track was skipped!');

  if (nextTrackUrl) {
    const resource = createAudioResourceFromYouTubeURL(nextTrackUrl);
    player.play(resource);
  }
};

export { data, execute };
