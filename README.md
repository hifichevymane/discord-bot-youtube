# discord-bot-youtube

the discord bot written on js to play youtube videos in the voice channel

# Setup

1. Install dependencies:

```sh
npm install
```

2. Install `pm2`:

```sh
npm install pm2 -g
```

# Run the bot

## DEV:

Run the bot in DEV mode:

```sh
npm run dev
```

`Ctrl + C` to stop the bot

## Deploy the bot

Compile TypeScript code:

```sh
npm run build
```

Run bot on the background:

```sh
npm run deploy:app
```

Stop bot:

```sh
npm stop
```

Open logs:

```sh
npm run logs:show
```

To close logs press `Ctrl + C`

Clear logs:

```sh
npm run logs:clear
```
