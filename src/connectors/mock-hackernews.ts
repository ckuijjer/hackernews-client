import frontPageData from '../../data/frontpage.json';
import storyData from '../../data/story-33726816.json';

import { Story, Comment } from './types';

export const getFrontPage = async () =>
  frontPageData.map((story) => mapStory(story));

const mapStory = (story: any): Story => ({
  ...story,
  createdAt: new Date(story.createdAt),
  comments: story.comments?.map((comment: any) => mapComment(comment)),
});

export const getStory = async () => {
  const story = mapStory(storyData);
  return story;
};

const mapComment = (comment: any): Comment => ({
  ...comment,
  createdAt: new Date(comment.createdAt),
  comments: comment.comments?.map((comment: any) => mapComment(comment)) ?? [],
});
