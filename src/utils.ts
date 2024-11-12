import { createAudioResource } from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';

export const createAudioResourceFromYouTubeURL = (url) => {
  const stream = ytdl(url, {
    quality: 'highestaudio',
    filter: 'audioonly',
    liveBuffer: 2000,
    highWaterMark: 1 << 25,
  });

  stream.on('error', (err) => {
    stream.destroy();
    console.error('Streaming failed:', err);
  });

  return createAudioResource(stream);
};
