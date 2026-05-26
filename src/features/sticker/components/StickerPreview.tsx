import { forwardRef } from 'react';

type StickerPreviewProps = {
  svgMarkup: string;
};

export const StickerPreview = forwardRef<HTMLDivElement, StickerPreviewProps>(function StickerPreview(
  { svgMarkup },
  ref,
) {
  return (
    <>
      <div className="mb-4 flex w-full max-w-[340px] items-end justify-between md:max-w-[380px] lg:max-w-[420px]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFD700]">Pré-visualização da Figurinha</h2>
        <span className="text-[10px] uppercase tracking-widest text-white/40">Tamanho Real</span>
      </div>

      <div
        ref={ref}
        className="sticker-preview-frame aspect-[49/65] w-full max-w-[340px] shrink-0 overflow-hidden rounded-[4px] shadow-2xl md:max-w-[380px] lg:max-w-[420px]"
      >
        <div className="sticker-preview-svg h-full w-full bg-white" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
      </div>
    </>
  );
});
