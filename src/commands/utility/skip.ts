import { SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import player from '../../audio-player.js';

const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skips the current playing video');

const execute = async (interaction) => {
  if (player.state.status !== AudioPlayerStatus.Playing) {
    await interaction.reply("There's no playing videos!");
    return;
  }

  // When we stop a player it will play next track by event
  player.stop();
  await interaction.reply('The current video was skipped!');
};

export default { data, execute };
