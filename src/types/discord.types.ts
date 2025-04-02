export interface INewPullRequestMessageContent {
  id: number;
  url: string;
  title: string;
  number: 3;
  description: string;
  repository: {
    name: string;
    owner: string;
  };
  user: {
    id: number;
    url: string;
    username: string;
    avatar_url: string;
  };
}
