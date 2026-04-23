# AGENTS.md

## Project Overview

`hackernews-client` is an Expo React Native app for browsing Hacker News stories and comments.

The app uses:

- Expo / React Native for the UI
- React Navigation for screen transitions
- TanStack Query for fetching and caching HN data
- Firebase Realtime Database SDK for the Hacker News API
- `react-native-render-html` for story and comment content

## Repository Layout

- `App.tsx`: app bootstrap, navigation container, React Query provider, and theme selection
- `src/screens/FrontPageScreen.tsx`: front page story list screen
- `src/screens/StoryScreen.tsx`: story detail screen with comments
- `src/connectors/hackernews.ts`: live Hacker News API connector
- `src/connectors/mock-hackernews.ts`: local mock data connector
- `src/connectors/types.ts`: shared story/comment types
- `src/StoriesList.tsx`: reusable list UI for story listings
- `src/Comment.tsx`: comment rendering and collapse interaction
- `src/RenderHtml.tsx`: app-wide HTML renderer wrapper
- `src/utils/`: small utilities such as logging, browser opening, and time formatting
- `assets/`: app icons and splash images
- `data/`: mock front page and story JSON fixtures

## Data Flow

1. `App.tsx` sets up the navigation stack and `QueryClientProvider`.
2. `FrontPageScreen` fetches top stories with `getFrontPage`.
3. Selecting a story navigates to `StoryScreen` with `id`, `title`, and `url`.
4. `StoryScreen` fetches full story data with comments via `getStory`.
5. `StoriesList`, `Comment`, and `RenderHtml` handle presentation concerns.

## Working Rules

- Prefer small, local changes in the component or connector that owns the behavior.
- Keep shared data shapes in `src/connectors/types.ts` aligned with the connector output.
- Preserve the existing Expo/React Native style: functional components, hooks, and platform colors.
- Avoid introducing new state libraries or navigation abstractions unless necessary.
- Do not overwrite unrelated work in the tree.

## Important Implementation Notes

- Live data currently comes from the Firebase HN API in `src/connectors/hackernews.ts`.
- Mock fixtures exist in `src/connectors/mock-hackernews.ts` and `data/` for offline or demo usage.
- `RenderHtml` centralizes link handling and text styling; change it before adding ad hoc HTML rendering elsewhere.
- `configureLogging()` in `src/utils/logger.ts` can suppress logs when Expo config sets `extra.ignoreErrorAndWarningNotifications`.
- `StoryScreen` contains comment flattening and collapse logic; it is the main place to adjust comment behavior.

## Commands

Use Yarn, not npm, for this repo.

- Install dependencies: `yarn install`
- Start Expo: `yarn start`
- Run on iOS: `yarn ios`
- Run on Android: `yarn android`
- Run web: `yarn web`
- Format code: `yarn format`

## Style Notes

- TypeScript is strict via `tsconfig.json`.
- Prettier uses single quotes.
- Keep imports organized and avoid unnecessary abstraction.
- Use ASCII by default unless the file already contains non-ASCII text.

## Cautions

- `package-lock.json` is not the intended lockfile for this project.
- `StoryScreen` has some unfinished interaction logic around comment scrolling and collapse behavior; review carefully before changing it.
- The floating action button currently logs to the console and contains gesture state that may need cleanup if touched.

