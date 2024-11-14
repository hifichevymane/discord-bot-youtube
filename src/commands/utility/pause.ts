import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import player from '../../audio-player';
import Command from '../../Command';

export default class PauseCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the current playing track');

  public async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('Please join the voice channel first');
      return;
    }

    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (!connection) {
      await interaction.reply('The bot is not playing!');
      return;
    }

    player.pause();
    await interaction.reply('The current track was paused');
  }
}
