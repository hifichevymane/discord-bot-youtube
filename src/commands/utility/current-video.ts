import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../../Command";
import player from "../../audio-player";

export default class CurrentVideoCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('current-video')
    .setDescription('Get current video that is playing');
  public async execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    const currentVideoURL = player.getCurrentVideoURL();
    if (!currentVideoURL) {
      await interaction.reply('No video is playing right now!');
      return;
    }
    await interaction.reply(`${currentVideoURL} is playing right now`);
  }
}
