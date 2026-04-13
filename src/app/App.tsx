/**
 * Video Captions Starterkit - Main App Component
 *
 * Provides mode selection and editor integration for video captioning.
 */

import { useCallback, useRef, useState } from 'react';
import CreativeEditorSDK, { type Configuration } from '@cesdk/cesdk-js';

import {
  type CaptionMode,
  initVideoCaptionsAutocaptionEditor,
  initVideoCaptionsBlankEditor,
  initVideoCaptionsImportEditor,
  initVideoCaptionsPreCaptionedEditor
} from '../imgly';
import { resolveAssetPath } from './resolveAssetPath';

import styles from './App.module.css';

interface AppProps {
  editorConfig: Configuration;
}

const CAPTION_MODES: Array<{
  mode: CaptionMode;
  label: string;
  description: string;
  image: string;
}> = [
  {
    mode: 'autocaption',
    label: 'AI Auto Captions',
    description: 'Generate captions automatically using AI',
    image: resolveAssetPath('/assets/autocaption-preview.png')
  },
  {
    mode: 'blank',
    label: 'Blank Video Editor',
    description:
      'Upload or create a video, then manually add or import captions.',
    image: resolveAssetPath('/assets/blank-preview.png')
  },
  {
    mode: 'import',
    label: 'Caption Import',
    description: 'Import captions from an SRT file.',
    image: resolveAssetPath('/assets/import-preview.png')
  },
  {
    mode: 'pre-captioned',
    label: 'Pre-captioned Video',
    description: 'Edit a video with existing captions and adjust as needed.',
    image: resolveAssetPath('/assets/pre-captioned-preview.png')
  }
];

export function App({ editorConfig }: AppProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);

  const closeEditor = useCallback(() => {
    if (cesdkRef.current) {
      cesdkRef.current.dispose();
      cesdkRef.current = null;
    }
    setIsEditorOpen(false);
  }, []);

  const openEditor = useCallback(
    async (mode: CaptionMode) => {
      setIsEditorOpen(true);

      // Wait for DOM to update
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const cesdk = await CreativeEditorSDK.create('#cesdk_container', {
        ...editorConfig,
        callbacks: {
          onUpload: 'local'
        }
      });

      cesdkRef.current = cesdk;

      // Debug access (remove in production)
      (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;

      // Register close callback
      cesdk.ui.registerComponent(
        'ly.img.close.navigationBar',
        ({ builder }) => {
          builder.Button('close', {
            label: 'common.close',
            icon: '@imgly/Cross',
            variant: 'regular',
            onClick: closeEditor
          });
        }
      );

      // Initialize based on mode
      switch (mode) {
        case 'autocaption':
          await initVideoCaptionsAutocaptionEditor(cesdk);
          break;
        case 'blank':
          await initVideoCaptionsBlankEditor(cesdk);
          break;
        case 'import':
          await initVideoCaptionsImportEditor(cesdk);
          break;
        case 'pre-captioned':
          await initVideoCaptionsPreCaptionedEditor(cesdk);
          break;
      }
    },
    [editorConfig, closeEditor]
  );

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        closeEditor();
      }
    },
    [closeEditor]
  );

  const handleDownloadSrt = useCallback(() => {
    const link = document.createElement('a');
    link.href = resolveAssetPath('/assets/captions.srt');
    link.download = 'captions.srt';
    link.click();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <h4 className={`h4 ${styles.heading}`}>Select Your Demo Option</h4>

        <div className={styles.cardGrid}>
          {CAPTION_MODES.map(({ mode, label, description, image }) => (
            <div key={mode} className={styles.card}>
              <img
                alt={`${label} Preview`}
                src={image}
                className={styles.cardImage}
              />
              <div className={styles.cardText}>
                <h5 className={`h5 ${styles.cardTitle}`}>{label}</h5>
                <p className={styles.cardDescription}>{description}</p>
              </div>
              <div className={styles.cardActions}>
                {mode === 'import' ? (
                  <div className={styles.buttonGroup}>
                    <button
                      className="button button--secondary button--small"
                      onClick={handleDownloadSrt}
                    >
                      <span>Download .srt File</span>
                    </button>
                    <button
                      className="button button--primary button--small"
                      onClick={() => openEditor(mode)}
                    >
                      <span>Open Editor</span>
                    </button>
                  </div>
                ) : (
                  <button
                    className="button button--primary button--small"
                    onClick={() => openEditor(mode)}
                  >
                    <span>Open Editor</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditorOpen && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div id="cesdk_container" className={styles.editorContainer} />
        </div>
      )}
    </div>
  );
}
