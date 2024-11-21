import { TextChannel } from 'discord.js';
import { AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';

import { getNextVideo } from './video-queue';
import { createAudioResourceFromYouTubeURL } from './utils';
import { client } from './client';

class CustomAudioPlayer extends AudioPlayer {
  currentTextChannelId = '';
};

const player = new CustomAudioPlayer();
player.on(AudioPlayerStatus.Idle, async () => {
  const url = getNextVideo();
  if (!url) return;

  const resource = createAudioResourceFromYouTubeURL(url);
  player.play(resource);

  const currentTextChannelId = player.currentTextChannelId;
  const channel = client.channels.cache.get(currentTextChannelId) as TextChannel | undefined;
  if (!channel) return;
  await channel.send(`Now is playing: ${url}`);
});

export default player;
