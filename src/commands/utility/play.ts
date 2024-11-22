import { SlashCommandBuilder } from 'discord.js';
import {
  joinVoiceChannel,
  getVoiceConnection,
  AudioPlayerStatus,
} from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';
import ytpl from '@distube/ytpl';

import getAudioPlayer from '../../audio-player';
import { createAudioResourceFromYouTubeURL } from '../../utils';
import Command from '../../Command';

import { ChatInputCommandInteraction } from 'discord.js';
import { VoiceConnection } from '@discordjs/voice';

const PLAYLIST_VIDEO_LIMIT = 20;

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

    const isVideo = ytdl.validateURL(url);
    const isPlaylist = ytpl.validateID(url);
    if (!isVideo && !isPlaylist) {
      await interaction.reply('Invalid url');
      return;
    }

    try {
      const player = getAudioPlayer();
      player.setCurrentTextChannelId(interaction.channelId);

      let playlist;
      if (isPlaylist) {
        playlist = await ytpl(url);
        if (playlist.total_items === 0) {
          await interaction.reply('The playlist is empty!');
          return;
        } else if (playlist.total_items > PLAYLIST_VIDEO_LIMIT) {
          await interaction.reply(`The video limit of the playlist is ${PLAYLIST_VIDEO_LIMIT}`);
          return;
        }
      }
      if (player.state.status === AudioPlayerStatus.Playing) {
        if (isVideo) {
          player.addVideoToQueue(url);
          await interaction.reply(`The video ${url} was added to a queue`);
          return;
        } else if (isPlaylist) {
          playlist?.items.forEach(({ url }) => {
            player.addVideoToQueue(url);
          });
          await interaction.reply(`The playlist ${url} was added to a queue`);
          return;
        }
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

      if (isVideo) {
        const resource = createAudioResourceFromYouTubeURL(url);
        player.play(resource);
        player.setCurrentVideoURL(url);
        connection.subscribe(player);

        await interaction.reply(`Now playing ${url}`);
      } else if (isPlaylist) {
        const firstVideoInPlaylist = playlist?.items[0]
        const playlistFirstVideoURL = firstVideoInPlaylist?.url;
        if (!playlistFirstVideoURL) {
          await interaction.reply('The video was not found');
          return;
        }

        const resource = createAudioResourceFromYouTubeURL(playlistFirstVideoURL);
        player.play(resource);
        player.setCurrentVideoURL(playlistFirstVideoURL);
        connection.subscribe(player);

        await interaction.reply(`Now playing ${playlistFirstVideoURL}`);
        playlist?.items.forEach(({ url }, idx) => {
          if (idx === 0) return;
          player.addVideoToQueue(url);
        });
      }
    } catch (err) {
      console.error('Failed to stream youtube video: ', err);
      await interaction.reply('Failed to stream youtube video');
    }
  }
}
