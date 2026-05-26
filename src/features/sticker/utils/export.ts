function triggerDownload(url: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
}

async function renderStickerPngBlob(svgMarkup: string) {
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Falha ao processar o template SVG.'));
      img.src = svgUrl;
    });

    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D indisponível neste navegador.');
    }

    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.drawImage(image, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    if (!blob) {
      throw new Error('Falha ao gerar o PNG.');
    }

    return blob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export function downloadStickerSvg(svgMarkup: string, filename: string) {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

export async function downloadStickerPng(svgMarkup: string, filename: string) {
  const blob = await renderStickerPngBlob(svgMarkup);
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  URL.revokeObjectURL(url);
}

export async function shareStickerPng(svgMarkup: string, filename: string) {
  const blob = await renderStickerPngBlob(svgMarkup);
  const file = new File([blob], filename, { type: 'image/png' });

  if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
    throw new Error('Compartilhamento de arquivos não suportado neste navegador.');
  }

  await navigator.share({
    files: [file],
    title: 'Minha figurinha da Copa 2026',
    text: 'Criei minha figurinha personalizada no Sticker Studio 2026.',
  });
}
