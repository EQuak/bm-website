/**
 * @file Component exports for the mobile application
 * @module components
 * @description Central export file for all shared components
 * @author Team TUC
 */

// Loading components
export {
  default as Loader,
  InlineLoading,
  LoadingOverlay,
  LoadingSpinner,
  PulsingDots
} from "./loader"

// Splash screen
export { SplashScreen } from "./SplashScreen"
// UI Components
export * from "./ui/notification-badge"

// Note: Types are defined within the loader module but not explicitly exported
// Users can import the component and infer types using React.ComponentProps if needed
// Example: React.ComponentProps<typeof LoadingSpinner>
