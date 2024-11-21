import { SlashCommandBuilder } from 'discord.js';
import {
  joinVoiceChannel,
  getVoiceConnection,
  AudioPlayerStatus,
} from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';

import player from '../../audio-player';
import { addVideoToQueue } from '../../video-queue';
import { createAudioResourceFromYouTubeURL } from '../../utils';
import Command from '../../Command';

import type { ChatInputCommandInteraction } from 'discord.js';
import type { VoiceConnection } from '@discordjs/voice';

export default class PlayCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play Youtube video by URL')
    .addStringOption((option) =>
      option.setName('url').setDescription('youtube url link').setRequired(true)
    );

  public async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    const url = interaction.options.getString('url', true);

    const voiceChannel = interaction.member?.voice?.channel;
    if (!voiceChannel) {
      await interaction.reply('You should join a voice channel first!');
      return;
    }

    if (!ytdl.validateURL(url)) {
      await interaction.reply('Invalid url');
      return;
    }

    try {
      if (player.state.status === AudioPlayerStatus.Playing) {
        addVideoToQueue(url);
        await interaction.reply(`The video ${url} was added to a queue`);
        return;
      }

      const guildId = voiceChannel.guild.id;
      let connection: VoiceConnection | undefined;
      const existingConnection = getVoiceConnection(guildId);

      if (existingConnection) {
        connection = existingConnection;
      } else {
        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guildId,
          // @ts-expect-error: This is a bug of Discord.js library
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
      }

      const resource = createAudioResourceFromYouTubeURL(url);
      player.play(resource);
      connection.subscribe(player);

      await interaction.reply(`Now playing ${url}`);
    } catch (err) {
      console.error('Failed to stream youtube video: ', err);
      await interaction.reply('Failed to stream youtube video');
    }
  }
}
