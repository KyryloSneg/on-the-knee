# Welcome to the first web (frontend) app of mine *"On the knee"*
## How to open it?
To test it, you first need to [download the mock server](https://downgit.evecalm.com/#/home?url=https://github.com/KyryloSneg/on-the-knee/tree/main/client/jsonServer)

Install dependencies

```shell
npm install
```

Run it

```shell
npm run server
```

[Open the client](https://on-the-knee.vercel.app).
There you go (ignore the 401 errors, everything is fine).

**NOTE**: every time you run the mock server, re-select your location.
## Why have I made it?
I've been thinking a long time about making an e-shop / marketplace website like **ROZETKA** or **Citrus** did, so after learning the basics of React, I started working on it. And, despite the time I took me to bring my idea to life, I did it.
## Technology stack
- HTML5, CSS, JS (of course)
- React and React-related libraries (like RHF)
- Mobx
## What could be improved?
- using css vars
- using already existing ui libs (I wanted to implement most of them from "scratch")
- using libraries that provides different animations (same as with the previous point)
- using the real server instead of the mock one, as it would decrease the amount of unefficient client-side filtrations, sorting etc. (but it's a frontend project, so idc)
- implementing panels for content, order and seller managers, sellers themselves and maybe for the owner
- some tiny optimizations for various data fetching logic
- replace moment.js library with something modern
- using google maps (but i don't want to leak my address in order to use them)
## Special thanks to
- **Vercel** for the opportunity to deploy this application
- **ROZETKA** and **Citrus** for the inspiration
