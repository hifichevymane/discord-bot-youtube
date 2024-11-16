import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { emptyVideoQueue } from '../../video-queue';
import Command from '../../Command';

export default class StopCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('stop the audio and disconnects from the channel');

  public async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('Please connect to the channel first');
      return;
    }

    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (!connection) {
      await interaction.reply('No voice connection was detected');
      return;
    }

    connection.destroy();
    emptyVideoQueue();
    await interaction.reply('The bot has been stopped');
  }
}