# Canutin Desktop

## Available Scripts

### `yarn start`

Runs the Electron app in the development mode.

The Electron app will reload if you make edits in the `electron` directory.<br>
You will also see any lint errors in the console.

### `yarn build`

Builds the Electron app package for production to the `dist` folder.

Your Electron app is ready to be distributed!

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
