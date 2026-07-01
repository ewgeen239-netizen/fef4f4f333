// Vercel Speed Insights initialization
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights when the DOM is ready
if (typeof window !== 'undefined') {
  // Initialize Speed Insights
  injectSpeedInsights({
    debug: false, // Set to true for development debugging
  });
}
