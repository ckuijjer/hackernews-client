export type Story = {
  id: number;
  user: string;
  title: string;
  text?: string;
  url: string;
  createdAt: Date;
  score: number;
  numberOfComments: number;
  comments?: Comment[];
};

export type Comment = {
  id: number;
  user: string;
  text?: string;
  createdAt: Date;
  comments: Comment[];
};
