import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { Story, Comment } from '../types';

const app = initializeApp({
  databaseURL: 'https://hacker-news.firebaseio.com',
});
const db = getDatabase(app);

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

const getValue = async (path: string) => (await get(ref(db, path))).val();

export const getFrontPage = async () => {
  const ids: number[] = await getValue('v0/topstories');

  const items: Item[] = await Promise.all(
    ids.map((id: number) => getValue(`v0/item/${id}`)),
  );

  return items.map((item) => mapStory(item));
};

export const getStory = async (id: number) => {
  const item: Item = await getValue(`v0/item/${id}`);
  const comments = await Promise.all((item.kids ?? []).map(getComment));

  return mapStory(item, comments);
};

const getComment = async (id: number): Promise<Comment> => {
  const item: Item = await getValue(`v0/item/${id}`);
  const children = await Promise.all((item.kids ?? []).map(getComment));

  return mapComment(item, children);
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

const mapComment = (item: Item, comments: Comment[]): Comment => {
  return {
    id: item.id,
    user: item.by,
    text: item.text,
    createdAt: unixTimeToDate(item.time),
    comments,
  };
};
