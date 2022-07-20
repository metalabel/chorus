import 'dotenv/config';
import got from 'got';
import DiscordLibrary from 'discord.js';
import TwitterLibrary from 'twitter';

// Initialize Discord client
const Discord = new DiscordLibrary.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
});

// Initialize Twitter client
const Twitter = new TwitterLibrary({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Set the bot's status/presence to online
Discord.on('ready', () => {
  Discord.user.setStatus('online');
});

// Detects when a user reacts to a message and then sends a tweet if the reaction requirements are met
Discord.on('messageReactionAdd', async (reaction) => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  // Check if the reaction was in one of the allowed channels
  if (
    process.env.DISCORD_CHANNELS.split(',').includes(reaction.message.channelId)
  ) {
    if (reaction.me === true) {
      console.log('Already posted to Twitter or rejected. Stopping.');
      return;
    }

    const message = reaction.message;

    // Do not attempt to post to Twitter if the message is longer than 280 characters
    if (message.content && message.content.length > 280) {
      await message.react(process.env.TWEET_ERROR);
      await message.reply(
        'Message is too long to post to Twitter. Try condensing to 280 characters or less.'
      );
      return;
    }

    let tweet = {
      status: message.content ? message.content : '',
    };

    // Check for standard Unicode emoji *or* custom emoji reaction matching the configured emoji
    const emoji =
      reaction &&
      (reaction.emoji.id === process.env.TWEET_REACTION_EMOJI ||
        reaction.emoji.name === process.env.TWEET_REACTION_EMOJI)
        ? reaction.emoji
        : null;

    if (
      emoji &&
      reaction.emoji.reaction.count >= process.env.TWEET_REACTION_THRESHOLD
    ) {
      const includesMedia = message.attachments.first();

      // Upload media if the message includes an attachment
      if (includesMedia !== undefined) {
        let attachment = message.attachments.first();

        // Check if the attachment is a png, jpeg or jpg
        if (
          ['image/png', 'image/jpeg', 'image/jpg'].includes(
            attachment.contentType
          )
        ) {
          const response = await got(attachment.url, {
            responseType: 'buffer',
          });
          const buffer = response.body;

          try {
            let uploadedMedia = await Twitter.post('media/upload', {
              media: buffer,
            });
            tweet.media_ids = uploadedMedia.media_id_string;
          } catch (error) {
            await message.react(process.env.TWEET_ERROR);
            await message.reply(
              error && error[0]
                ? `Error ${error[0].code}: ${error[0].message}`
                : error.message
            );

            return;
          }
        } else {
          await message.reply('Image file must be a PNG, JPG or JPEG.');
          return;
        }
      }

      // Post the tweet
      Twitter.post('statuses/update', tweet)
        .then((response) => {
          message.react(process.env.TWEET_SUCCESS);
          message.reply(
            `https://twitter.com/${response.user.screen_name}/status/${response.id_str}`
          );
        })
        .catch((error) => {
          message.react(process.env.TWEET_ERROR);
          message.reply(
            error && error[0]
              ? `Error ${error[0].code}: ${error[0].message}`
              : error.message
          );
        });
    }
  }
});

// Login to Discord as the bot
Discord.login(process.env.DISCORD_BOT_TOKEN);
