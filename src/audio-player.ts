import { AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import type { GuildTextBasedChannel } from 'discord.js';

import { createAudioResourceFromYouTubeURL } from './utils';

class CustomAudioPlayer extends AudioPlayer {
  private currentVideoURL: string | null = null;
  private videoQueue: string[] = [];
  private currentTextChannel: GuildTextBasedChannel | null = null;

  public getCurrentVideoURL(): string | null {
    return this.currentVideoURL;
  }

  public setCurrentVideoURL(url: string): void {
    this.currentVideoURL = url;
  }

  public getVideoQueue(): string[] {
    return this.videoQueue;
  }

  public addVideoToQueue(url: string): void {
    this.videoQueue.push(url);
  }

  public getNextVideo(): string | null {
    const videoUrl = this.videoQueue.shift() || null;
    this.currentVideoURL = videoUrl;
    return videoUrl;
  }

  public emptyVideoQueue(): void {
    this.videoQueue = [];
    this.currentVideoURL = null;
  }

  public getCurrentTextChannel(): GuildTextBasedChannel | null {
    return this.currentTextChannel;
  }

  public setCurrentTextChannel(channel: GuildTextBasedChannel | null): void {
    this.currentTextChannel = channel;
  }
};

const player = new CustomAudioPlayer();

player.on('error', async (err) => {
  console.error(`The error happened with AudioPlayer: ${err.message}`);

  const channel = player.getCurrentTextChannel();
  if (!channel) return;
  await channel.send(`Ooops... The error happened: ${err.message}`);
});

player.on(AudioPlayerStatus.Idle, async () => {
  const url = player.getNextVideo();
  if (!url) return;

  const resource = createAudioResourceFromYouTubeURL(url);
  player.play(resource);

  const channel = player.getCurrentTextChannel();
  if (!channel) return;
  await channel.send(`Now is playing: ${url}`);
});

const getAudioPlayer = (): CustomAudioPlayer => {
  return player;
};

export default getAudioPlayer;
