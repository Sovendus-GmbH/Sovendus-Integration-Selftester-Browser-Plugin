import type { OverlayState } from "./hooks/useOverlayState";

export interface UiState {
  overlaySize: OverlaySize;
  integrationType: IntegrationType | undefined;
  testingState: TestingState;
  isPromptVisible: boolean;
}

export enum OverlaySize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum IntegrationType {
  CB_VN = "Checkout Benefits & Voucher Network",
  CHECKOUT_PRODUCTS = "Checkout Products",
  OPTIMIZE = "Optimize",
}

export enum TestingState {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum PageType {
  UNKNOWN = "unknown",
  LANDING = "landing",
  SUCCESS = "success",
  NAVIGATION_PROMPT = "navigation_prompt",
}

export interface OverlayDimensions {
  width: number;
  height: number;
}

export interface StepProps {
  overlayState: OverlayState;
}
