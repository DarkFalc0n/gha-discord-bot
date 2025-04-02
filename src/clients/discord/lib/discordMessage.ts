import { INewPullRequestMessageContent } from '@/types/discord.types';
import { Message, MessageCreateOptions } from 'discord.js';
import { newPullRequestReactions } from '../constants/reactions';
import { v4 as uuid } from 'uuid';
import { generateNewPullRequestEmbedDescription } from '../utils/generateEmbedDescription';
import { newPullRequestEmbedData } from '../constants/embedData';

export class DiscordMessage {
  private constructor() {}

  public static newPullRequestMessage(
    messageContent: INewPullRequestMessageContent
  ) {
    const messageEmbedVersion = uuid();
    return {
      embeds: [
        {
          author: {
            name: messageContent.user.username,
            icon_url: messageContent.user.avatar_url,
            url: messageContent.user.url,
          },
          title: newPullRequestEmbedData.title,
          color: newPullRequestEmbedData.color,
          description:
            generateNewPullRequestEmbedDescription(),
          url: messageContent.url,
          image: {
            url: `https://opengraph.githubassets.com/${messageEmbedVersion}/${messageContent.repository.owner}/${messageContent.repository.name}/pull/${messageContent.number}`,
          },
        },
      ],
    } satisfies MessageCreateOptions;
  }

  public static async reactToPullRequestMessage(
    message: Message<true>
  ) {
    for (const reaction of newPullRequestReactions) {
      await message.react(reaction.emoji);
    }
  }
}
