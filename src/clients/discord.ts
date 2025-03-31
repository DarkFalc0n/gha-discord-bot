import { config } from "@/utils/env";
import { Client, GatewayIntentBits } from "discord.js";

export class DiscordClient {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
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
