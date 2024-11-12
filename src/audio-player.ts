import { createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { getNextVideo } from './video-queue.js';
import { createAudioResourceFromYouTubeURL } from './utils.js';

const player = createAudioPlayer();

player.on(AudioPlayerStatus.Idle, () => {
  const url = getNextVideo();
  if (!url) return;

  const resource = createAudioResourceFromYouTubeURL(url);
  player.play(resource);
});

export default player;
