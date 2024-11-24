import frontPageData from '../../data/frontpage.json';
import storyData from '../../data/story-33726816.json';

import { Story, Comment } from './types';

export const getFrontPage = async () =>
  frontPageData.map((story) => mapStory(story));

const mapStory = (story): Story => ({
  ...story,
  createdAt: new Date(story.createdAt),
});

export const getStory = async () => {
  const story = mapStory(storyData);
  story.comments = storyData.comments?.map((comment) => mapComment(comment));

  return story;
};

const mapComment = (comment): Comment => ({
  ...comment,
  createdAt: new Date(comment.createdAt),
  comments: comment.comments?.map((comment) => mapComment(comment)),
});
