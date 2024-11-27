import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Command from '../../Command';
import getAudioPlayer from '../../audio-player';

export default class ResumeCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the current track if it was paused');

  public async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('Please join the voice channel first!');
      return;
    }

    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (!connection) {
      await interaction.reply('The bot is not playing!');
      return;
    }

    const player = getAudioPlayer();
    player.unpause();
    await interaction.reply('The current track was resumed!');
  }
}
