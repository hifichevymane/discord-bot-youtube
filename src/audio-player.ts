import { TextChannel } from 'discord.js';
import { AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';

import { getNextVideo } from './video-queue';
import { createAudioResourceFromYouTubeURL } from './utils';
import { client } from './client';

class CustomAudioPlayer extends AudioPlayer {
  private currentTextChannelId: string | undefined;
  private currentVideoURL: string | undefined;

  public getCurrentTextChannelId(): string | undefined {
    return this.currentTextChannelId;
  }

  public setCurrentTextChannelId(channelId: string): void {
    this.currentTextChannelId = channelId;
  }

  public getCurrentVideoURL(): string | undefined {
    return this.currentVideoURL;
  }

  public setCurrentVideoURL(url: string): void {
    this.currentVideoURL = url;
  }
};

const player = new CustomAudioPlayer();
player.on(AudioPlayerStatus.Idle, async () => {
  const url = getNextVideo();
  if (!url) return;

  const resource = createAudioResourceFromYouTubeURL(url);
  player.play(resource);

  const currentTextChannelId = player.getCurrentTextChannelId();
  if (!currentTextChannelId) return;

  const channel = client.channels.cache.get(currentTextChannelId) as TextChannel | undefined;
  if (!channel) return;

  await channel.send(`Now is playing: ${url}`);
});

const getAudioPlayer = (): CustomAudioPlayer => {
  return player;
};

export default getAudioPlayer;
