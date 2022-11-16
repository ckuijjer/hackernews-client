import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const app = initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com',
});
const db = getDatabase(app);

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

type Item = {
  id: number;
  deleted: boolean;
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt';
  by: string;
  time: number;
  text?: string;
  dead: boolean;
  parent: number;
  poll: number;
  kids?: number[];
  url: string;
  score: number;
  title: string;
  parts: number[];
  descendants: number;
};

const unixTimeToDate = (time: number) => new Date(time * 1000);

// no error handling etc at all
const getValue = async (path: string) => (await get(ref(db, path))).val();

export const getFrontPage = async () => {
  const ids: number[] = await getValue('v0/topstories');

  const items: Item[] = await Promise.all(
    ids.map((id: number) => getValue(`v0/item/${id}`)),
  );

  return items.map((item) => mapStory(item));
};

const mapStory = (item: Item, comments?: Comment[]): Story => {
  const story: Story = {
    id: item.id,
    user: item.by,
    title: item.title,
    text: item.text,
    url: item.url,
    score: item.score,
    numberOfComments: item.descendants,
    createdAt: unixTimeToDate(item.time),
  };

  if (comments !== undefined) {
    story.comments = comments;
  }

  return story;
};

// wouldn't work for job, poll I think
export const getStory = async (id: number) => {
  console.log('getStory', id);

  const item: Item = await getValue(`v0/item/${id}`);
  const comments = await Promise.all((item.kids ?? []).map(getComment));

  return mapStory(item, comments);
};

const getComment = async (id: number): Promise<Comment> => {
  console.log('getComment', id);

  const item: Item = await getValue(`v0/item/${id}`);
  const children = await Promise.all((item.kids ?? []).map(getComment));

  return mapComment(item, children);
};

const mapComment = (item: Item, comments: Comment[]): Comment => {
  return {
    id: item.id,
    user: item.by,
    text: item.text,
    createdAt: unixTimeToDate(item.time),
    comments,
  };
};
