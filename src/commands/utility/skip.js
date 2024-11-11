import { SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import player from '../../audio-player.js';

const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skips the current track');

const execute = async (interaction) => {
  if (player.state.status !== AudioPlayerStatus.Playing) {
    await interaction.reply("There's no playing tracks!");
    return;
  }

  player.stop();
  await interaction.reply('The current track was skipped!');
};

export { data, execute };
