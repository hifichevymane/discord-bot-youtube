import { SlashCommandBuilder } from 'discord.js';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from '@discordjs/voice';
import ytdl from '@distube/ytdl-core';

const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play Youtube video by URL')
  .addStringOption((option) =>
    option.setName('url').setDescription('youtube url link').setRequired(true)
  );

const execute = async (interaction) => {
  const url = interaction.options.getString('url');

  const voiceChannel = interaction.member.voice.channel;
  if (!voiceChannel) {
    await interaction.reply('You should join a voice channel first!');
    return;
  }

  if (!ytdl.validateURL(url)) {
    await interaction.reply('Invalid url');
    return;
  }

  try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const stream = ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });
    stream.on('error', (err) => {
      stream.destroy();
      console.error('Streaming failed:', err);
    });

    const resource = createAudioResource(stream);
    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy(); // Leave the channel when playback ends
    });

    await interaction.reply(`Now playing ${url}`);
  } catch (err) {
    console.error('Failed to stream youtube audio: ', err);
    await interaction.reply('Failed to stream youtube audio');
  }
};

export { data, execute };
