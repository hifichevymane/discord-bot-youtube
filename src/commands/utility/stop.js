import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { emptyTrackQueue } from '../../track-queue.js';

const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('stop the audio and disconnects from the channel');

const execute = async (interaction) => {
  const voiceChannel = interaction.member.voice.channel;
  const connection = getVoiceConnection(voiceChannel.guild.id);

  if (!connection) {
    await interaction.reply('No voice connection was detected');
    return;
  }

  connection.destroy();
  emptyTrackQueue();
  await interaction.reply('The bot has been stopped');
};

export { data, execute };
