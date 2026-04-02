/**
 * CE.SDK Video Captions - Initialization Module
 *
 * This module provides video captioning with multiple modes:
 * - autocaption: AI-powered caption generation
 * - blank: Empty video editor
 * - import: SRT file import
 * - pre-captioned: Edit existing captions
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  UploadAssetSources
} from '@cesdk/cesdk-js/plugins';

import { VideoEditorConfig } from './config/plugin';
import { createAutocaptionPlugin } from './plugins/auto-caption';

// Export types
export type CaptionMode = 'autocaption' | 'blank' | 'import' | 'pre-captioned';

// Export configuration plugin
export { VideoEditorConfig } from './config/plugin';

// Export autocaption plugin factory
export { createAutocaptionPlugin } from './plugins/auto-caption';

/**
 * Initialize the CE.SDK Video Editor in autocaption mode.
 *
 * This function configures a CE.SDK instance for AI-powered caption generation:
 * - Adds the autocaption plugin with ElevenLabsScribeV2 provider
 * - Loads a sample video for captioning
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initAutocaptionEditor(cesdk: CreativeEditorSDK) {
  const engine = cesdk.engine;

  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Add the autocaption plugin
  await cesdk.addPlugin(createAutocaptionPlugin());

  // Load autocaption sample video
  await cesdk.loadFromArchiveURL(
    'https://img.ly/showcases/cesdk/cases/video-captions/autocaption.archive.zip'
  );

  const page = engine.scene.getCurrentPage();
  if (page) {
    engine.block.setPlaybackTime(page, 0);
  }

  // Configure navigation bar
  cesdk.i18n.setTranslations({
    en: { 'actions.export.video': 'Export Video' }
  });

  const navOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' });
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.navigation.bar' },
    [
      { id: 'ly.img.close.navigationBar' },
      ...navOrder.filter(
        (item) =>
          !['ly.img.close.navigationBar', 'ly.img.preview.navigationBar'].includes(item.id)
      ),
      {
        id: 'ly.img.exportVideo.navigationBar',
        key: 'actions.export.video',
        color: 'accent',
        icon: '@imgly/Video',
        label: 'actions.export.video',
        onClick: async () => {
          await cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
        }
      }
    ]
  );

  // Disable page resize
  cesdk.feature.set('ly.img.page.resize', false);

  // Open caption inspector
  cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
}

/**
 * Initialize the CE.SDK Video Editor in blank mode.
 *
 * This function configures a CE.SDK instance for creating videos from scratch:
 * - Creates a new blank video scene
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initBlankEditor(cesdk: CreativeEditorSDK) {
  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Create a new blank video scene
  await cesdk.actions.run('scene.create', {
    mode: 'Video',
    page: { width: 1280, height: 720, unit: 'Pixel' }
  });

  // Configure navigation bar (must be done after scene.create)
  cesdk.i18n.setTranslations({
    en: { 'actions.export.video': 'Export Video' }
  });

  const navOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' });
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.navigation.bar' },
    [
      { id: 'ly.img.close.navigationBar' },
      ...navOrder.filter(
        (item) =>
          !['ly.img.close.navigationBar', 'ly.img.preview.navigationBar'].includes(item.id)
      ),
      {
        id: 'ly.img.exportVideo.navigationBar',
        key: 'actions.export.video',
        color: 'accent',
        icon: '@imgly/Video',
        label: 'actions.export.video',
        onClick: async () => {
          await cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
        }
      }
    ]
  );

  // Disable page resize
  cesdk.feature.set('ly.img.page.resize', false);

  // Open caption inspector
  cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
}

/**
 * Initialize the CE.SDK Video Editor in import mode.
 *
 * This function configures a CE.SDK instance for importing SRT caption files:
 * - Loads a sample video for caption import demonstration
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initImportEditor(cesdk: CreativeEditorSDK) {
  const engine = cesdk.engine;

  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Load scene for SRT import
  await cesdk.loadFromArchiveURL(
    'https://img.ly/showcases/cesdk/cases/video-captions/captions.archive'
  );

  const page = engine.scene.getCurrentPage();
  if (page) {
    engine.block.setPlaybackTime(page, 0);
  }

  // Configure navigation bar
  cesdk.i18n.setTranslations({
    en: { 'actions.export.video': 'Export Video' }
  });

  const navOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' });
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.navigation.bar' },
    [
      { id: 'ly.img.close.navigationBar' },
      ...navOrder.filter(
        (item) =>
          !['ly.img.close.navigationBar', 'ly.img.preview.navigationBar'].includes(item.id)
      ),
      {
        id: 'ly.img.exportVideo.navigationBar',
        key: 'actions.export.video',
        color: 'accent',
        icon: '@imgly/Video',
        label: 'actions.export.video',
        onClick: async () => {
          await cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
        }
      }
    ]
  );

  // Disable page resize
  cesdk.feature.set('ly.img.page.resize', false);

  // Open caption inspector
  cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
}

/**
 * Initialize the CE.SDK Video Editor in pre-captioned mode.
 *
 * This function configures a CE.SDK instance for editing existing captions:
 * - Loads a video with pre-embedded captions
 * - Automatically selects the first caption for editing
 * - Configures the video editor UI
 * - Opens the caption inspector panel
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export async function initPreCaptionedEditor(cesdk: CreativeEditorSDK) {
  const engine = cesdk.engine;

  // Add configuration plugin
  await cesdk.addPlugin(new VideoEditorConfig());

  // Add asset source plugins
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new CaptionPresetsAssetSource());
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: [
        'ly.img.image.upload',
        'ly.img.video.upload',
        'ly.img.audio.upload'
      ]
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: [
        'ly.img.templates.video.*',
        'ly.img.image.*',
        'ly.img.audio.*',
        'ly.img.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(
    new PagePresetsAssetSource({
      include: [
        'ly.img.page.presets.instagram.*',
        'ly.img.page.presets.facebook.*',
        'ly.img.page.presets.x.*',
        'ly.img.page.presets.linkedin.*',
        'ly.img.page.presets.pinterest.*',
        'ly.img.page.presets.tiktok.*',
        'ly.img.page.presets.youtube.*',
        'ly.img.page.presets.video.*'
      ]
    })
  );
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Load pre-captioned scene (with captions already embedded)
  await cesdk.loadFromArchiveURL(
    'https://img.ly/showcases/cesdk/cases/video-captions/captions-pre-captioned.archive'
  );

  const page = engine.scene.getCurrentPage();
  if (page) {
    engine.block.setPlaybackTime(page, 0);
  }

  // Select the first caption for editing
  const captionTrack = engine.block.findByType('captionTrack')[0];
  if (captionTrack) {
    engine.block.findAllSelected().forEach((block) => {
      engine.block.setSelected(block, false);
    });
    const children = engine.block.getChildren(captionTrack);
    if (children.length > 0) {
      engine.block.setSelected(children[0], true);
    }
  }

  // Configure navigation bar
  cesdk.i18n.setTranslations({
    en: { 'actions.export.video': 'Export Video' }
  });

  const navOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.navigation.bar' });
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.navigation.bar' },
    [
      { id: 'ly.img.close.navigationBar' },
      ...navOrder.filter(
        (item) =>
          !['ly.img.close.navigationBar', 'ly.img.preview.navigationBar'].includes(item.id)
      ),
      {
        id: 'ly.img.exportVideo.navigationBar',
        key: 'actions.export.video',
        color: 'accent',
        icon: '@imgly/Video',
        label: 'actions.export.video',
        onClick: async () => {
          await cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
        }
      }
    ]
  );

  // Disable page resize
  cesdk.feature.set('ly.img.page.resize', false);

  // Open caption inspector
  cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
}
