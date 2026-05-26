import { RefreshCw, Settings, Upload } from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';
import { DEFAULT_STICKER_DATA } from '../defaults';
import type { StickerData, StickerFrameStyle } from '../types';
import { readFileAsDataUrl } from '../utils/files';

type StickerEditorFormProps = {
  sticker: StickerData;
  onFieldChange: <Key extends keyof StickerData>(field: Key, value: StickerData[Key]) => void;
};

const inputClassName =
  'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none transition focus:border-[#FFD700]';

export function StickerEditorForm({ sticker, onFieldChange }: StickerEditorFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameOptions: Array<{
    label: string;
    value: StickerFrameStyle;
    swatch: string;
  }> = [
    { label: 'Clássica', value: 'classic', swatch: sticker.borderColor },
    {
      label: 'Dourada',
      value: 'golden',
      swatch: 'linear-gradient(135deg, #FFF0A8 0%, #D4AF37 25%, #AA771C 50%, #D4AF37 75%, #FFF0A8 100%)',
    },
    {
      label: 'Festiva',
      value: 'festive',
      swatch: 'linear-gradient(45deg, #E30A17, #FFCE00, #009B3A, #002776)',
    },
    {
      label: 'Neon',
      value: 'neon',
      swatch: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 60%, #42ffd1 100%)',
    },
  ];

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const imageDataUrl = await readFileAsDataUrl(file);
    onFieldChange('imageDataUrl', imageDataUrl);
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-[#001D3D]/50 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD700]">
          <Upload size={18} className="opacity-60" />
          1. Enviar Foto
        </h2>

        <div className="flex flex-col gap-4">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 bg-white/5 py-8 transition-colors hover:bg-white/10"
          >
            {sticker.imageDataUrl ? (
              <>
                <RefreshCw size={24} className="text-[#FFD700]" />
                <span className="text-sm font-medium text-white/60">Trocar Foto</span>
              </>
            ) : (
              <>
                <Upload size={28} className="text-white opacity-40" />
                <span className="max-w-[200px] text-center text-xs font-medium text-white/60">
                  Clique para selecionar uma foto do seu dispositivo
                </span>
                <span className="max-w-[200px] text-center text-[10px] opacity-40">
                  Recomendado: PNG com fundo transparente
                </span>
              </>
            )}
          </button>

          {sticker.imageDataUrl ? (
            <button
              type="button"
              onClick={() => {
                onFieldChange('imageDataUrl', null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-center text-[11px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
            >
              Remover Foto
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#001D3D]/50 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD700]">
          <Settings size={18} className="opacity-60" />
          2. Personalizar Informações
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-white/50">Nome do Jogador</span>
            <input
              className={inputClassName}
              value={sticker.name}
              onChange={(event) => onFieldChange('name', event.target.value.toUpperCase())}
            />
          </label>

          <label>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-white/50">Data de Nascimento</span>
            <input
              className={inputClassName}
              value={sticker.birthDate}
              onChange={(event) => onFieldChange('birthDate', event.target.value)}
              placeholder="24-01-2002"
            />
          </label>

          <label>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-white/50">Altura</span>
            <input
              className={inputClassName}
              value={sticker.height}
              onChange={(event) => onFieldChange('height', event.target.value)}
              placeholder="1,82 m"
            />
          </label>

          <label>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-white/50">Peso</span>
            <input
              className={inputClassName}
              value={sticker.weight}
              onChange={(event) => onFieldChange('weight', event.target.value)}
              placeholder="64 kg"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-white/50">Detalhes do Time</span>
            <input
              className={inputClassName}
              value={sticker.team}
              onChange={(event) => onFieldChange('team', event.target.value.toUpperCase())}
              placeholder="CRUZEIRO EC (BRA)"
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#001D3D]/50 p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD700]">
          <Settings size={18} className="opacity-60" />
          3. Estilo da Moldura
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-[10px] uppercase tracking-wide text-white/50">Borda Clássica (Cor)</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={sticker.borderColor}
                onChange={(event) => {
                  onFieldChange('borderColor', event.target.value);
                  onFieldChange('frameStyle', 'classic');
                }}
                className="h-8 w-8 cursor-pointer rounded border-none bg-transparent p-0"
              />
              <span className="text-xs uppercase tabular-nums text-white/80">{sticker.borderColor}</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="mb-2 block text-[10px] uppercase tracking-wide text-white/50">Estilo da Moldura</span>
            <div className="flex flex-wrap gap-3">
              {frameOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFieldChange('frameStyle', option.value)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-wide transition ${
                    sticker.frameStyle === option.value
                      ? 'border-[#FFD700] bg-white/10 text-white'
                      : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span
                    className="block h-5 w-5 rounded-full border border-white/30"
                    style={{ background: option.swatch }}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onFieldChange('name', DEFAULT_STICKER_DATA.name);
            onFieldChange('birthDate', DEFAULT_STICKER_DATA.birthDate);
            onFieldChange('height', DEFAULT_STICKER_DATA.height);
            onFieldChange('weight', DEFAULT_STICKER_DATA.weight);
            onFieldChange('team', DEFAULT_STICKER_DATA.team);
            onFieldChange('imageDataUrl', DEFAULT_STICKER_DATA.imageDataUrl);
            onFieldChange('borderColor', DEFAULT_STICKER_DATA.borderColor);
            onFieldChange('frameStyle', DEFAULT_STICKER_DATA.frameStyle);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/72 transition hover:border-white/30 hover:text-white"
        >
          <RefreshCw size={14} />
          Restaurar Conteúdo Padrão
        </button>
      </div>
    </div>
  );
}
