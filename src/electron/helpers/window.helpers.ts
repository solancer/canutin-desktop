import isDev from 'electron-is-dev';

export const MIN_WINDOW_WIDTH = 1200;
export const MIN_WINDOW_HEIGHT = 768;

export const calculateWindowWidth = (displayWidth: number) => {
  const DEV_TOOLS_PANEL_WIDTH = 512;

  const idealMaxWindowWidth = isDev ? 1440 + DEV_TOOLS_PANEL_WIDTH : 1440;
  const relativeWindowWidth = isDev
    ? displayWidth * 0.7 + DEV_TOOLS_PANEL_WIDTH
    : displayWidth * 0.7;

  if (relativeWindowWidth < MIN_WINDOW_WIDTH) {
    return MIN_WINDOW_WIDTH;
  } else if (relativeWindowWidth > idealMaxWindowWidth) {
    return idealMaxWindowWidth;
  } else {
    return relativeWindowWidth;
  }
};

export const calculateWindowHeight = (displayHeight: number) => {
  const relativeWindowHeight = displayHeight * 0.8;
  return relativeWindowHeight < MIN_WINDOW_HEIGHT ? MIN_WINDOW_HEIGHT : relativeWindowHeight;
};
