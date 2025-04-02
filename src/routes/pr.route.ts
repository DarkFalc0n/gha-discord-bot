import { Hono } from 'hono';
import { DiscordClient } from '@/clients/discord';
import { config } from '@/utils/env';
import { DiscordMessage } from '@/clients/discord/lib/discordMessage';
import { Message } from 'discord.js';

const app = new Hono();

app.post('/', async (ctx) => {
  const body = await ctx.req.json();
  if (!body?.action) {
    return ctx.json('Not a valid webhook call', 400);
  }
  if (body.action === 'opened') {
    try {
      const channel = await DiscordClient.client.channels.fetch(config.DISCORD_MESSAGE_CHANNEL_ID);
      if (!channel?.isSendable()) {
        return ctx.json('Channel is not a text channel', 400);
      }
      const message = await channel.send(
        DiscordMessage.newPullRequestMessage({
          description: body.pull_request.body,
          id: body.pull_request.id,
          title: body.pull_request.title,
          number: body.pull_request.number,
          url: body.pull_request.html_url,
          repository: {
            name: body.repository.name,
            owner: body.repository.owner.login,
          },
          user: {
            avatar_url: body.pull_request.user.avatar_url,
            url: body.pull_request.user.html_url,
            id: body.pull_request.user.id,
            username: body.pull_request.user.login,
          },
        })
      );
      await DiscordMessage.reactToPullRequestMessage(message as Message<true>);
      return ctx.json('Message sent', 200);
    } catch (error) {
      console.error('Error sending PR notification to Discord:', error);
      return ctx.json({ error: 'Failed to send message to Discord' }, 500);
    }
  }
});

export default app;
