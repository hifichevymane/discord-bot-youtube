import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List of possible commands');

const execute = async (interaction) => {
  await interaction.reply('List of possible commands');
};

export { data, execute };
