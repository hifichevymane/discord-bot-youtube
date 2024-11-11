import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import player from '../../audio-player.js';

const data = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Pauses the current playing track');

const execute = async (interaction) => {
  const voiceChannel = interaction.member.voice.channel;
  const connection = getVoiceConnection(voiceChannel.guild.id);

  if (!connection) {
    await interaction.reply('The bot is not playing!');
    return;
  }

  player.pause();
  await interaction.reply('The current track was paused');
};

export { data, execute };
