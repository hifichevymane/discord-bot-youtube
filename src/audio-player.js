import { createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice';

const player = createAudioPlayer();

player.on(AudioPlayerStatus.Idle, () => {
  connection.destroy(); // Leave the channel when playback ends
});

export default player;
