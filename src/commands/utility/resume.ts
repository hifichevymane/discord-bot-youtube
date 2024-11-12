import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import player from '../../audio-player';

const data = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resumes the current track if it was paused');

const execute = async (interaction) => {
  const voiceChannel = interaction.member.voice.channel;
  const connection = getVoiceConnection(voiceChannel.guild.id);

  if (!connection) {
    await interaction.reply('The bot is not playing!');
    return;
  }

  player.unpause();
  await interaction.reply('The current track was resumed!');
};

export default { data, execute };
