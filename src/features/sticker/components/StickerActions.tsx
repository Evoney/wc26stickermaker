import { Download, FileImage, RotateCcw, Share2 } from 'lucide-react';

type StickerActionsProps = {
  exporting: boolean;
  canShare: boolean;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  onShare: () => void;
  onReset: () => void;
};

export function StickerActions({
  exporting,
  canShare,
  onDownloadPng,
  onDownloadSvg,
  onShare,
  onReset,
}: StickerActionsProps) {
  return (
    <div className="mt-6 flex w-full max-w-[340px] shrink-0 flex-col gap-3 md:max-w-[380px] lg:max-w-[420px]">
      <button
        type="button"
        onClick={onDownloadPng}
        disabled={exporting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD700] px-6 py-4 font-bold text-[#002B5B] transition-all hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] disabled:cursor-wait disabled:opacity-75"
      >
        <Download size={24} />
        {exporting ? 'Exportando...' : 'Baixar Imagem'}
      </button>

      {canShare ? (
        <button
          type="button"
          onClick={onShare}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-bold text-white transition-all hover:bg-white/20"
        >
          <Share2 size={22} />
          Compartilhar Figurinha
        </button>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onDownloadSvg}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-bold text-white transition-all hover:bg-white/20"
        >
          <FileImage size={18} />
          SVG
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-bold text-white transition-all hover:bg-white/20"
        >
          <RotateCcw size={18} />
          Resetar
        </button>
      </div>
    </div>
  );
}
