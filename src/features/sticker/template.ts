import stickerSvgTemplate from '../../../assets/stickerwc26.svg?raw';
import type { StickerData, StickerFrameStyle } from './types';

const INNER_WIDTH = 4885.78;
const INNER_HEIGHT = 6481.14;
const FRAME_INSET = 170;
const PHOTO_FRAME = {
  x: 620,
  y: 1620,
  width: 3200,
  height: 3460,
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function normalizeInlineText(value: string) {
  return escapeXml(value.trim().replace(/\s+/g, ' '));
}

function formatHeight(value: string) {
  const normalized = value.replace(/\s+/g, '').replace('.', ',').toLowerCase();

  if (/^\d,\d{2}m$/.test(normalized)) {
    return normalized.replace('m', ' m');
  }

  if (/^\d,\d{2}$/.test(normalized)) {
    return `${normalized} m`;
  }

  return value.trim();
}

function formatWeight(value: string) {
  const normalized = value.replace(/\s+/g, '').toLowerCase();

  if (/^\d{2,3}kg$/.test(normalized)) {
    return normalized.replace('kg', ' kg');
  }

  if (/^\d{2,3}$/.test(normalized)) {
    return `${normalized} kg`;
  }

  return value.trim();
}

function buildStatsLine(sticker: StickerData) {
  return normalizeInlineText(
    `${sticker.birthDate.trim()} | ${formatHeight(sticker.height)} | ${formatWeight(sticker.weight)}`,
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getNameTypography(name: string) {
  const length = name.trim().length;
  const fontSize = clamp(290 - Math.max(length - 10, 0) * 8, 178, 272.77);
  const textLength = clamp(2100 + Math.max(length - 12, 0) * 40, 2100, 2850);
  const letterSpacing = clamp(-Math.max(length - 16, 0) * 2.2, -24, 0);

  return { fontSize, textLength, letterSpacing };
}

function getStatsTypography(stats: string) {
  const length = stats.trim().length;
  const fontSize = clamp(230 - Math.max(length - 24, 0) * 4, 144, 224.12);
  const textLength = clamp(2050 + Math.max(length - 20, 0) * 36, 2050, 3000);
  const letterSpacing = clamp(-Math.max(length - 28, 0) * 1.1, -12, 0);

  return { fontSize, textLength, letterSpacing };
}

function getTeamTypography(team: string) {
  const length = team.trim().length;
  const fontSize = clamp(232 - Math.max(length - 18, 0) * 5.5, 146, 222.23);
  const textLength = clamp(2250 + Math.max(length - 18, 0) * 42, 2250, 3200);
  const letterSpacing = clamp(-Math.max(length - 24, 0) * 1.4, -14, 0);

  return { fontSize, textLength, letterSpacing };
}

function buildPhotoLayer(imageDataUrl: string | null) {
  const photoClipDef = `
  <clipPath id="player-photo-clip">
   <rect x="${PHOTO_FRAME.x}" y="${PHOTO_FRAME.y}" width="${PHOTO_FRAME.width}" height="${PHOTO_FRAME.height}" />
  </clipPath>`;

  const placeholderLayer = `
  <g id="player-photo-layer">
   <rect x="${PHOTO_FRAME.x}" y="${PHOTO_FRAME.y}" width="${PHOTO_FRAME.width}" height="${PHOTO_FRAME.height}" fill="none" />
   <text x="${PHOTO_FRAME.x + PHOTO_FRAME.width / 2}" y="${PHOTO_FRAME.y + PHOTO_FRAME.height / 2}" text-anchor="middle" class="fil21" style="font-size:168px;font-family:'Montserrat Medium';letter-spacing:20px">ADICIONE UMA FOTO</text>
  </g>`;

  if (!imageDataUrl) {
    return { defs: photoClipDef, layer: placeholderLayer };
  }

  const encodedImage = escapeXml(imageDataUrl);

  return {
    defs: photoClipDef,
    layer: `
  <g id="player-photo-layer">
   <rect x="${PHOTO_FRAME.x}" y="${PHOTO_FRAME.y}" width="${PHOTO_FRAME.width}" height="${PHOTO_FRAME.height}" fill="none" />
   <image
    x="${PHOTO_FRAME.x}"
    y="${PHOTO_FRAME.y}"
    width="${PHOTO_FRAME.width}"
    height="${PHOTO_FRAME.height}"
    preserveAspectRatio="xMidYMin slice"
    clip-path="url(#player-photo-clip)"
    href="${encodedImage}"
    xlink:href="${encodedImage}" />
  </g>`,
  };
}

function buildFrameDefs(style: StickerFrameStyle, borderColor: string) {
  switch (style) {
    case 'golden':
      return `
  <linearGradient id="card-frame-fill" x1="0%" y1="0%" x2="100%" y2="100%">
   <stop offset="0%" style="stop-color:#FFF0A8;stop-opacity:1" />
   <stop offset="22%" style="stop-color:#F3D66D;stop-opacity:1" />
   <stop offset="50%" style="stop-color:#AA771C;stop-opacity:1" />
   <stop offset="78%" style="stop-color:#E3C35A;stop-opacity:1" />
   <stop offset="100%" style="stop-color:#FFF0A8;stop-opacity:1" />
  </linearGradient>`;
    case 'festive':
      return `
  <linearGradient id="card-frame-fill" x1="0%" y1="0%" x2="100%" y2="100%">
   <stop offset="0%" style="stop-color:#E30A17;stop-opacity:1" />
   <stop offset="32%" style="stop-color:#FFCE00;stop-opacity:1" />
   <stop offset="68%" style="stop-color:#009B3A;stop-opacity:1" />
   <stop offset="100%" style="stop-color:#002776;stop-opacity:1" />
  </linearGradient>`;
    case 'neon':
      return `
  <linearGradient id="card-frame-fill" x1="0%" y1="0%" x2="100%" y2="100%">
   <stop offset="0%" style="stop-color:#00F2FE;stop-opacity:1" />
   <stop offset="52%" style="stop-color:#4FACFE;stop-opacity:1" />
   <stop offset="100%" style="stop-color:#42FFD1;stop-opacity:1" />
  </linearGradient>
  <filter id="card-frame-glow" x="-20%" y="-20%" width="140%" height="140%">
   <feGaussianBlur stdDeviation="18" result="blur" />
   <feMerge>
    <feMergeNode in="blur" />
    <feMergeNode in="SourceGraphic" />
   </feMerge>
  </filter>`;
    case 'classic':
    default:
      return `
  <linearGradient id="card-frame-fill" x1="0%" y1="0%" x2="100%" y2="100%">
   <stop offset="0%" style="stop-color:${borderColor};stop-opacity:1" />
   <stop offset="100%" style="stop-color:${borderColor};stop-opacity:1" />
  </linearGradient>`;
  }
}

function buildFrameLayer(style: StickerFrameStyle) {
  const outerRadius = 220;
  const innerRadius = 96;
  const scale = (INNER_WIDTH - FRAME_INSET * 2) / INNER_WIDTH;
  const verticalInset = (INNER_HEIGHT - INNER_HEIGHT * scale) / 2;
  const neonFilter = style === 'neon' ? ' filter="url(#card-frame-glow)"' : '';
  const innerStroke = style === 'golden' ? '#FFF6CC' : style === 'neon' ? '#D9FFFF' : '#FFFFFF';
  const innerStrokeOpacity = style === 'classic' ? '0.42' : style === 'festive' ? '0.26' : '0.54';

  return `
 <rect x="0" y="0" width="${INNER_WIDTH}" height="${INNER_HEIGHT}" rx="${outerRadius}" fill="url(#card-frame-fill)"${neonFilter} />
 <rect x="${FRAME_INSET / 2}" y="${verticalInset / 2}" width="${INNER_WIDTH - FRAME_INSET}" height="${INNER_HEIGHT - verticalInset}" rx="${outerRadius - 70}" fill="none" stroke="${innerStroke}" stroke-opacity="${innerStrokeOpacity}" stroke-width="22" />
 <rect x="${FRAME_INSET}" y="${verticalInset}" width="${INNER_WIDTH - FRAME_INSET * 2}" height="${INNER_HEIGHT - verticalInset * 2}" rx="${innerRadius}" fill="#FFFFFF" fill-opacity="0.18" />
 <g transform="translate(${FRAME_INSET} ${verticalInset}) scale(${scale})">`;
}

function finalizeFrameLayer() {
  return '</g>';
}

function extractDefs(svgMarkup: string) {
  const match = svgMarkup.match(/<defs>[\s\S]*?<\/defs>/);
  return match?.[0] ?? '<defs></defs>';
}

function extractLayer(svgMarkup: string) {
  const match = svgMarkup.match(/<g id="Camada_x0020_1">[\s\S]*<\/g>\s*(?=<\/svg>\s*$)/);
  return match?.[0] ?? '';
}

function stripSvgShell(svgMarkup: string) {
  return svgMarkup
    .replace(/^<\?xml[\s\S]*?\?>\s*/i, '')
    .replace(/<!DOCTYPE[\s\S]*?>\s*/i, '')
    .trim();
}

export function buildStickerSvg(sticker: StickerData) {
  const safeName = normalizeInlineText(sticker.name || 'NOME DO JOGADOR');
  const safeTeam = normalizeInlineText(sticker.team || 'CLUBE');
  const safeStats = buildStatsLine(sticker);
  const { defs, layer } = buildPhotoLayer(sticker.imageDataUrl);
  const nameTypography = getNameTypography(safeName);
  const statsTypography = getStatsTypography(safeStats);
  const teamTypography = getTeamTypography(safeTeam);

  const processedTemplate = stripSvgShell(
    stickerSvgTemplate
      .replace(
        '</defs>',
        `${defs}
  <linearGradient id="player-photo-placeholder" x1="0%" y1="0%" x2="100%" y2="100%">
   <stop offset="0%" style="stop-color:#48C2C9;stop-opacity:1" />
   <stop offset="100%" style="stop-color:#1A6E89;stop-opacity:1" />
  </linearGradient>
 </defs>`,
      )
      .replace(
        '<g id="panini-logo.svg">',
        `${layer}
  <g id="panini-logo.svg">`,
      )
      .replace(
        /<g transform="matrix\(0\.995074 0 0 1 -1187\.05 2421\.41\)">[\s\S]*?<\/g>/,
        `<g transform="matrix(0.995074 0 0 1 -1187.05 2421.41)">
   <text x="2450" y="3240.04" class="fil21 fnt0" textLength="${nameTypography.textLength}" lengthAdjust="spacingAndGlyphs" style="font-size:${nameTypography.fontSize}px;letter-spacing:${nameTypography.letterSpacing}px">${safeName}</text>
  </g>`,
      )
      .replace(
        /<g transform="matrix\(0\.995077 0 0 1 -1808\.32 2683\.2\)">[\s\S]*?<\/g>/,
        `<g transform="matrix(0.995077 0 0 1 -1808.32 2683.2)">
   <text x="2450" y="3240.04" class="fil21 fnt1" textLength="${statsTypography.textLength}" lengthAdjust="spacingAndGlyphs" style="font-size:${statsTypography.fontSize}px;letter-spacing:${statsTypography.letterSpacing}px">${safeStats}</text>
  </g>`,
      )
      .replace(
        /<g transform="matrix\(0\.995075 0 0 1 -1282\.78 3074\.88\)">[\s\S]*?<\/g>/,
        `<g transform="matrix(0.995075 0 0 1 -1282.78 3074.88)">
   <text x="2450" y="3240.04" class="fil22 fnt2" textLength="${teamTypography.textLength}" lengthAdjust="spacingAndGlyphs" style="font-size:${teamTypography.fontSize}px;letter-spacing:${teamTypography.letterSpacing}px">${safeTeam}</text>
  </g>`,
      ),
  );

  const baseDefs = extractDefs(processedTemplate);
  const baseLayer = extractLayer(processedTemplate);
  const frameDefs = buildFrameDefs(sticker.frameStyle, sticker.borderColor);
  const mergedDefs = baseDefs.replace('</defs>', `${frameDefs}
 </defs>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="49mm" height="65mm" version="1.1" viewBox="0 0 ${INNER_WIDTH} ${INNER_HEIGHT}" xmlns:xlink="http://www.w3.org/1999/xlink">
 ${mergedDefs}
 ${buildFrameLayer(sticker.frameStyle)}
 ${baseLayer}
 ${finalizeFrameLayer()}
</svg>`;
}