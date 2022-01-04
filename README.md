# Canutin Desktop

<img width="1448" alt="Screen Shot 2021-12-21 at 11 13 51 AM" src="https://user-images.githubusercontent.com/1434675/146944233-696d2f81-5c20-4c28-9b83-dc1d080b6ec7.png">

## Available Scripts

#### `yarn start`

Runs the Electron app in the development mode.

#### `yarn test`

Runs the test suite.

#### `yarn build`

Builds the Electron app package for production to the `dist` folder.

## Project directory structure

```bash
canutin/
├── package.json
│
## render process
├── tsconfig.json
├── public/
├── src/
│
## main process
├── electron/
│   ├── main.ts
│   └── tsconfig.json
│
## build output
├── build/
│   ├── index.html
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   │
│   └── electron/
│      └── main.js
│
## distribution packges
└── dist/
    ├── mac/
    │   └── my-app.app
    └── my-app-0.1.0.dmg
```
