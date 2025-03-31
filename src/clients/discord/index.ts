import { Client } from "discord.js";
import { config } from "@/utils/env";
import { intents } from "@/clients/discord/constants/intents";

export class DiscordClient {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      intents,
    });
  }

  public start() {
    this.client.login(config.DISCORD_TOKEN).catch((error) => {
      console.error("Could not log into Discord application:", error);
    });

    this.client.once("ready", () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on("messageCreate", (message) => {
      if (message.author.bot) return;

      if (message.content === "!ping") {
        message.channel.send("Pong!");
      }
    });
  }
}
