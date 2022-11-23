# hackernews-client

## Overview

hackernews-client is a simple client for [Hacker News](https://news.ycombinator.com/).

* It's build in [React Native](https://reactnative.dev/) using [Expo](https://expo.dev).
* It uses [TanStack Query](https://tanstack.com/query/v4) and the [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup#add-sdk-and-initialize) to get the front page, stories, and comments from the official [Hacker News API](https://github.com/HackerNews/API).

## How to get the App running on your phone

Install [Expo Go](https://expo.dev/client) on your phone and afterwards use the camera to scan the QR code below. This will open the latest version of the app in Expo Go.

### QR Code for iOS

<img src="./qr-code-iOS.svg" width="200" />

### QR Code for Android

<img src="./qr-code-android.svg" width="200" />

## How to get a development environment running

The easiest way is to use [Expo Go](https://expo.dev/client) on your phone to open the app running on your laptop. This way you can see the changes you make in the code immediately on your phone.

1. Install [Node.js](https://nodejs.org/en/)
1. Clone the git repository
1. Run `npm install` in the root directory of the project
1. Run `npx expo start` (use `npx expo start --tunnel` when your phone is not on the same network as your laptop)
1. Use the camera of your phone to scan the QR code in the terminal

You should now see the app running on your phone, try making some changes to the code and see the changes immediately on your phone. You could for example change _src/screens/FrontPageScreen.tsx_ and change the `<Header>` to say _Hacker News_ instead of _Front Page_.

It's also possible to run the app in the [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) on macOS or the [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) on Windows or macOS.

## Example Hacker News API responses

See [example-hackernews-api-requests.http](./example-hackernews-api-requests.http) for example responses from the Hacker News API. You can use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for Visual Studio Code to run the requests.
