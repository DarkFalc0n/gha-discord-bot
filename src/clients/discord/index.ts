import { Client, Events } from 'discord.js';
import { config } from '@/utils/env';
import { intents, partials } from '@/clients/discord/constants/clientConfig';
import { newPullRequestReactions } from './constants/reactions';
import { GithubRestClient } from '../github';

export class DiscordClient {
  private static readonly _client: Client = new Client({
    intents,
    partials,
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

    DiscordClient._client.once(Events.ClientReady, () => {
      console.log(`Logged in as ${DiscordClient._client.user?.tag}!`);
    });

    DiscordClient._client.on(Events.MessageCreate, (message) => {
      if (message.author.bot) return;

      if (message.content === '!ping') {
        message.channel.send('Pong!');
      }
    });

    DiscordClient._client.on(Events.MessageReactionAdd, async (reaction, user) => {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          console.error('Something went wrong when fetching the reaction:', error);
          return;
        }
      }

      if (user.bot) return;

      if (newPullRequestReactions.map((r) => r.emoji).includes(reaction.emoji.name ?? '')) {
        const url = reaction.message.embeds[0]?.url ?? '';
        if (!url) return;

        const existingLabels = await GithubRestClient.instance.getPullRequestLabels(url);
        const existingLabelNames = existingLabels.map((label) => label.name);
        const { emoji, tag } =
          newPullRequestReactions.find((r) => r.emoji === reaction.emoji.name) ?? {};

        const currentLabelName = emoji + ' ' + tag;

        if (!existingLabelNames.includes(currentLabelName)) {
          GithubRestClient.instance
            .addLabelsToPullRequest(url, [...existingLabelNames, currentLabelName])
            .catch((error) => {
              console.error('Error adding label to pull request:', error);
            });
        }
      }
    });
  }
}
