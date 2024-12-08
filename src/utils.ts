import { createAudioResource } from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';
import { AudioResource } from '@discordjs/voice';

export const createAudioResourceFromYouTubeURL = (url: string): AudioResource<null> => {
  const stream = ytdl(url, {
    quality: 'highestaudio',
    filter: 'audioonly',
    liveBuffer: 2000,
    highWaterMark: 1 << 25,
  });

  stream.on('error', (err) => {
    console.error('Streaming failed:', err);
    stream.destroy(err);
  });

  return createAudioResource(stream);
};
