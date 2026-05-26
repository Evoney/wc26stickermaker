import { LogOut } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StickerActions } from '../sticker/components/StickerActions';
import { StickerEditorForm } from '../sticker/components/StickerEditorForm';
import { StickerPreview } from '../sticker/components/StickerPreview';
import { DEFAULT_STICKER_DATA } from '../sticker/defaults';
import { buildStickerSvg } from '../sticker/template';
import type { StickerData } from '../sticker/types';
import { downloadStickerPng, shareStickerPng } from '../sticker/utils/export';
import { useAuth } from '../auth/useAuth';

export function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sticker, setSticker] = useState<StickerData>(DEFAULT_STICKER_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const svgMarkup = useMemo(() => buildStickerSvg(sticker), [sticker]);

  const handleFieldChange = <Key extends keyof StickerData>(field: Key, value: StickerData[Key]) => {
    setSticker((current) => ({ ...current, [field]: value }));
  };

  const handleReset = () => {
    setSticker(DEFAULT_STICKER_DATA);
  };

  const baseFilename = useMemo(
    () =>
      `figurinha-wc26-${sticker.name
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'jogador'}`,
    [sticker.name],
  );

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error && error.message ? error.message : fallback;

  const exportPng = async () => {
    setIsExporting(true);
    try {
      await downloadStickerPng(svgMarkup, `${baseFilename}.png`);
    } catch (error) {
      console.error('Falha ao exportar PNG.', error);
      alert(getErrorMessage(error, 'Nao foi possivel baixar a imagem agora.'));
    } finally {
      setIsExporting(false);
    }
  };

  const sharePng = async () => {
    setIsExporting(true);
    try {
      await shareStickerPng(svgMarkup, `${baseFilename}.png`);
    } catch (error) {
      console.error('Falha ao compartilhar PNG.', error);
      alert(getErrorMessage(error, 'Nao foi possivel compartilhar a imagem agora.'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#002B5B] font-sans text-white md:h-screen">
      <header className="z-50 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#001D3D] px-4 md:px-6">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="WC 2026 Sticker Maker" className="h-10 w-auto" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-black uppercase tracking-tighter md:text-xl">WC 2026 Sticker Maker</h1>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
              Dashboard de criação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-xs font-semibold text-white">{user?.displayName ?? 'Usuário Google'}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{user?.email ?? 'Sessão ativa'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-wider text-white transition-colors hover:bg-white/10"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <section className="custom-scrollbar w-full shrink-0 space-y-6 overflow-y-auto border-t border-white/10 bg-[#001D3D]/50 p-5 md:w-[400px] md:border-t-0 md:border-r lg:w-[450px] lg:p-6">
          <StickerEditorForm sticker={sticker} onFieldChange={handleFieldChange} />
        </section>

        <section className="relative flex flex-1 flex-col items-center bg-[#002B5B] p-6 md:overflow-hidden md:p-4">
          <div className="custom-scrollbar flex w-full flex-col items-center py-2 md:max-h-full md:overflow-y-auto md:py-4">
            <StickerPreview svgMarkup={svgMarkup} />
            <StickerActions
              exporting={isExporting}
              canShare={canShare}
              onDownloadPng={exportPng}
              onShare={sharePng}
              onReset={handleReset}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
