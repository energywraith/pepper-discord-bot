# Pepper Discord Bot

It's a discord bot which main task is to send the updates on Pepper website.\
The application scans the page every 5 minutes to see if there are any new deals that can be sent to the servers.

## Commands

* ``/help`` - Sends DM with list of all my commands or info about a specific command.
* ``/deals [page(optional)]`` - List of Pepper deals from the home page or the specified one.

## Usage

I'm not providing my token for the security reasons, so if you would like to run the bot on your own machine, you need to create your own bot on discord page and then put the token in config.json, and add the bot to your server.

```
npm install
npm start
```

## Technologies

* Node.js
* Discord.js
* Cheerio
