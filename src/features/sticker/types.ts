export type StickerFrameStyle = 'classic' | 'golden' | 'festive' | 'neon';

export type StickerData = {
  name: string;
  birthDate: string;
  height: string;
  weight: string;
  team: string;
  imageDataUrl: string | null;
  borderColor: string;
  frameStyle: StickerFrameStyle;
};
