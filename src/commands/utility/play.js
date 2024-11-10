import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play Youtube video by URL');

const execute = async (interaction) => {
  await interaction.reply('play command');
};

export { data, execute };
