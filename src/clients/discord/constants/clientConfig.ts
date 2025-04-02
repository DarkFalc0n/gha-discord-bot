import { GatewayIntentBits, Partials } from 'discord.js';

export const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.MessageContent,
];

export const partials = [Partials.Message, Partials.Channel, Partials.Reaction];
