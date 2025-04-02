import { newPullRequestReactions } from '../constants/reactions';
export const generateNewPullRequestEmbedDescription = () => {
  let desc = '**React to assign labels:**';
  desc += '\n';
  newPullRequestReactions.forEach((reaction) => {
    desc += `${reaction.emoji} - ${reaction.tag}\n`;
  });
  return desc;
};
