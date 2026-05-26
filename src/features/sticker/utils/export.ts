function triggerDownload(url: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function getSvgDimensions(svgMarkup: string) {
  const viewBoxMatch = svgMarkup.match(/viewBox="[^"]*?\s([\d.]+)\s([\d.]+)"/i);
  if (viewBoxMatch) {
    return {
      width: Number(viewBoxMatch[1]),
      height: Number(viewBoxMatch[2]),
    };
  }

  const widthMatch = svgMarkup.match(/width="([\d.]+)(px|mm)?"/i);
  const heightMatch = svgMarkup.match(/height="([\d.]+)(px|mm)?"/i);

  if (widthMatch && heightMatch) {
    const toPixels = (value: number, unit?: string) =>
      unit === 'mm' ? value * 3.7795275591 : value;

    return {
      width: toPixels(Number(widthMatch[1]), widthMatch[2]),
      height: toPixels(Number(heightMatch[1]), heightMatch[2]),
    };
  }

  throw new Error('Não foi possível determinar o tamanho do SVG.');
}

function normalizeSvgForMobile(svgMarkup: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, 'image/svg+xml');
  const svgEl = doc.documentElement;

  if (!svgEl.getAttribute('xmlns')) {
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  if (!svgEl.getAttribute('width') || !svgEl.getAttribute('height')) {
    const { width, height } = getSvgDimensions(svgMarkup);
    svgEl.setAttribute('width', String(width));
    svgEl.setAttribute('height', String(height));
  }

  return new XMLSerializer().serializeToString(doc);
}

async function renderStickerPngBlob(svgMarkup: string): Promise<Blob> {
  const normalized = normalizeSvgForMobile(svgMarkup);
  const { width, height } = getSvgDimensions(normalized);
  const scale = Math.min(window.devicePixelRatio ?? 2, 3);

  const svgBase64 = btoa(unescape(encodeURIComponent(normalized)));
  const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.width = Math.round(width);
    img.height = Math.round(height);
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao processar o template SVG.'));
    img.src = svgDataUrl;
  });

  const canvas = document.createElement('canvas');

  const MAX_PIXELS = 16_000_000;
  const rawW = Math.round(width * scale);
  const rawH = Math.round(height * scale);
  const finalScale =
    rawW * rawH > MAX_PIXELS
      ? Math.sqrt(MAX_PIXELS / (width * height))
      : scale;

  canvas.width = Math.round(width * finalScale);
  canvas.height = Math.round(height * finalScale);

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D indisponível neste navegador.');
  }

  context.setTransform(finalScale, 0, 0, finalScale, 0, 0);
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });

  if (blob) return blob;

  // Retry: reduz o canvas pela metade e tenta de novo
  const fallbackCanvas = document.createElement('canvas');
  fallbackCanvas.width = Math.round(canvas.width / 2);
  fallbackCanvas.height = Math.round(canvas.height / 2);
  const fbCtx = fallbackCanvas.getContext('2d');
  if (!fbCtx) throw new Error('Canvas 2D indisponível neste navegador.');
  fbCtx.drawImage(canvas, 0, 0, fallbackCanvas.width, fallbackCanvas.height);

  const fallbackBlob = await new Promise<Blob | null>((resolve) => {
    fallbackCanvas.toBlob(resolve, 'image/png');
  });

  if (!fallbackBlob) throw new Error('Falha ao gerar o PNG.');
  return fallbackBlob;
}

export function downloadStickerSvg(svgMarkup: string, filename: string) {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadStickerPng(svgMarkup: string, filename: string) {
  const blob = await renderStickerPngBlob(svgMarkup);
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    window.open(url, '_blank');
  }

  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function shareStickerPng(svgMarkup: string, filename: string) {
  const blob = await renderStickerPngBlob(svgMarkup);
  const file = new File([blob], filename, { type: 'image/png' });

  const canShare =
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] });

  if (!canShare) {
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return;
  }

  await navigator.share({
    files: [file],
    title: 'Minha figurinha da Copa 2026',
    text: 'Criei minha figurinha personalizada no Sticker Studio 2026.',
  });
}