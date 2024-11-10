import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
  .setName('test')
  .setDescription('test commands');

const execute = async (interaction) => {
  await interaction.reply('Сосал?');
};

export { data, execute };
