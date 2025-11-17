# English Grammar Test Application

A web-based English grammar test focusing on Prepositions of Time and How much/How many quantifiers.

## Features

- 25 questions total (20 prepositions, 5 quantifiers)
- Timer to track test duration
- Real-time answer selection
- Comprehensive Telegram reporting
- Mobile-responsive design

## Setup Instructions

### 1. Environment Variables

Create a Telegram bot and get:
- `TELEGRAM_BOT_TOKEN`: Your bot token from @BotFather
- `TELEGRAM_CHAT_ID`: Your chat ID where reports will be sent

### 2. Deploy to Vercel

1. Fork this repository
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in Vercel project settings:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
4. Deploy!

### 3. Local Development

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
