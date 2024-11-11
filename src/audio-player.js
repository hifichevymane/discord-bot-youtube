import { createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';
import { getNextTrack } from './track-queue.js';
import { createAudioResourceFromYouTubeURL } from './utils.js';

const player = createAudioPlayer();

player.on(AudioPlayerStatus.Idle, () => {
  const url = getNextTrack();
  if (!url) return;

  const resource = createAudioResourceFromYouTubeURL(url);
  player.play(resource);
});

export default player;
