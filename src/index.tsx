/**
 * CE.SDK Video Captions Starterkit - React Entry Point
 *
 * Add and edit video captions with auto-captioning support.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';

// ============================================================================
// Configuration
// ============================================================================

const config: Configuration = {
  userId: 'starterkit-video-captions-user',

  // Local assets
  // baseURL: `/assets/`,

  // License key (required for production)
  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize React Application
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App editorConfig={config} />);
