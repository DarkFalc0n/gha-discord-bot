import { Client } from 'discord.js';
import { config } from '@/utils/env';
import { intents } from '@/clients/discord/constants/intents';

export class DiscordClient {
  private static readonly _client: Client = new Client({
    intents: intents,
  });

  private static _instance: DiscordClient;

  /**
   * Private constructor prevents direct construction calls with the `new` operator.
   */
  private constructor() {}

  public static get instance(): DiscordClient {
    if (!DiscordClient._instance) {
      DiscordClient._instance = new DiscordClient();
    }
    return DiscordClient._instance;
  }

  public static get client(): Client {
    return DiscordClient._client;
  }

  public start() {
    DiscordClient._client.login(config.DISCORD_TOKEN).catch((error) => {
      console.error('Could not log into Discord application:', error);
    });

    DiscordClient._client.once('ready', () => {
      console.log(`Logged in as ${DiscordClient._client.user?.tag}!`);
    });

    DiscordClient._client.on('messageCreate', (message) => {
      if (message.author.bot) return;

      if (message.content === '!ping') {
        message.channel.send('Pong!');
      }
    });
  }
}
