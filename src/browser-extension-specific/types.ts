export type ScreenShotRequest = {
  action: "TAKE_SCREENSHOT_SERVICE_WORKER";
};

export type ScreenShotResponse = {
  screenShotUri?: string;
  success: boolean;
  errorMessage: string | undefined;
};
