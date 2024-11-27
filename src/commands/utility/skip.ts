import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import Command from '../../Command';
import getAudioPlayer from '../../audio-player';

export default class SkipCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current playing video');

  public async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<void> {
    const player = getAudioPlayer();
    if (player.state.status !== AudioPlayerStatus.Playing) {
      await interaction.reply("There's no playing videos!");
      return;
    }

    // When we stop a player it will play next track by event
    player.stop();
    await interaction.reply('The current video was skipped!');
  }
}
