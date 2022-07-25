# CHORUS

CHORUS is a Discord bot that puts a community in direct control of what it tweets.

This Autocode app is provided as-is by [Metalabel](https://metalabel.xyz/) as part of a collaborative release with [Trust](https://trust.support/).

## Prerequisites

- [Discord App and Bot](https://discord.com/developers/applications)
- [Twitter account](https://twitter.com/), [Twitter Developer Account](https://developer.twitter.com/), and a [Twitter Application](https://developer.twitter.com/en/portal/projects-and-apps)
- [Twitter v1 API and User Access tokens](https://developer.twitter.com/en/docs/apps/overview)

**Note:** Twitter v1 API access is used to support media uploads, which is not yet available in the v2 API. In order to gain access to the v1 API, you’ll need to apply for Elevated access via Twitter's Developer Portal. You can learn more [here](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api#item0).

If you do not have access to the Twitter v1 APIs then you can install the [Autocode app](https://autocode.com/metalabel/apps/chorus/) as an alternative.

## Initial set-up and installation

You can use the Heroku one-click install by clicking the botton below and providing the following environment variables in the GUI.

[![Deploy on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/metalabel/chorus)

```
DISCORD_BOT_TOKEN=
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN_KEY=
TWITTER_ACCESS_TOKEN_SECRET=
DISCORD_CHANNELS=
TWEET_REACTION_EMOJI='❤️'
TWEET_REACTION_THRESHOLD=5
TWEET_ERROR='❌'
TWEET_SUCCESS='✅'
RESPOND_WITH_LINK=true
```

## Local development

In order to test and use the bot locally, you must have [Node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm) installed on your machine and be comfortable using a command-line interface.

To test and use the bot locally, you can do the following commands:

- Clone the project: `git clone git@github.com:laurendorman/color-of-berlin.git`
- Change to the project directory: `cd chorus`
- Install the project dependencies: `npm install`

### Create an `.env` file

In the project root, make a copy of the `.env.example` file with the following command:

```bash
cp .env.example .env
```

Following that, you will need to fill in the required environment variable values.

### Run the bot

In the project root, run `node index.js` from the command line to run the bot locally.
