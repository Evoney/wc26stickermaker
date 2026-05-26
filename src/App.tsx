import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Upload, Download, Camera, Settings, RefreshCw, Layers, Lock, Mail, Share2 } from 'lucide-react';

function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(String((R * (100 + percent)) / 100));
  G = parseInt(String((G * (100 + percent)) / 100));
  B = parseInt(String((B * (100 + percent)) / 100));

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('KAIO JORGE');
  const [dob, setDob] = useState('24-01-2002');
  const [height, setHeight] = useState('1,82m');
  const [weight, setWeight] = useState('64kg');
  const [team, setTeam] = useState('CRUZEIRO EC (BRA)');
  const [country, setCountry] = useState('BRA');
  
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [topBg, setTopBg] = useState('#36bccf');
  const [footerBg, setFooterBg] = useState('#137c8a');
  const [showWatermark, setShowWatermark] = useState(true);
  const [frameStyle, setFrameStyle] = useState('classic');

  const stickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadSticker = async () => {
    if (stickerRef.current) {
      try {
        const dataUrl = await toPng(stickerRef.current, { cacheBust: true, pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = `copa-2026-figurinha-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Falha ao exportar a figurinha', err);
      }
    }
  };

  const shareSticker = async () => {
    if (stickerRef.current) {
      try {
        const blob = await toBlob(stickerRef.current, { cacheBust: true, pixelRatio: 3 });
        if (!blob) throw new Error('Falha ao gerar a imagem');

        const file = new File([blob], `copa-2026-figurinha-${name.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Minha Figurinha da Copa 2026',
            text: 'Criei minha figurinha da Copa 2026 no Sticker Studio! Faça a sua também ⚽🏆'
          });
        } else {
          alert('O compartilhamento direto de arquivos não é suportado por este navegador. Por favor, use a opção "Baixar Imagem".');
        }
      } catch (err) {
        console.error('Falha ao compartilhar a figurinha', err);
        alert('Falha ao compartilhar a figurinha. (Nota: O navegador ou SO pode não suportar ou a operação foi cancelada)');
      }
    }
  };

  const getFrameStyle = () => {
    switch (frameStyle) {
      case 'golden': return { background: 'linear-gradient(135deg, #FFF0A8 0%, #D4AF37 25%, #AA771C 50%, #D4AF37 75%, #FFF0A8 100%)' };
      case 'festive': return { background: 'linear-gradient(45deg, #E30A17, #FFCE00, #009B3A, #002776)' };
      case 'neon': return { background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)' };
      case 'classic':
      default: return { backgroundColor: borderColor };
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#002B5B] flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center text-[#0F9B49]/10">
          <svg viewBox="0 0 200 250" className="w-[80%] h-[80%]" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
            <text x="-15" y="100" fontSize="150" fontWeight="900" transform="scale(1.3, 1)">2</text>
            <text x="35" y="195" fontSize="150" fontWeight="900" transform="scale(1.3, 1)">6</text>
          </svg>
        </div>

        <div className="bg-[#001D3D]/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 w-full max-w-md z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#FFD700] rounded-xl flex items-center justify-center text-[#002B5B] font-black text-3xl mb-4 shadow-lg shadow-[#FFD700]/20">
              26
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase text-white text-center">Sticker Studio 2026</h1>
            <p className="text-white/60 text-sm mt-2 text-center uppercase tracking-widest">Acesso de Torcedor</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-5">
            <div>
              <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">E-mail</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FFD700] focus:bg-white/10 text-white transition-all placeholder:text-white/20"
                />
                <Mail className="absolute left-3 top-3 text-white/40" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FFD700] focus:bg-white/10 text-white transition-all placeholder:text-white/20"
                />
                <Lock className="absolute left-3 top-3 text-white/40" size={18} />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-4 mt-2 bg-[#FFD700] text-[#002B5B] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all flex items-center justify-center gap-2"
            >
              Entrar na Conta
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] md:h-screen w-full bg-[#002B5B] flex flex-col font-sans text-white md:overflow-hidden">
      {/* Header */}
      <header className="h-14 px-4 md:px-6 flex items-center justify-between bg-[#001D3D] border-b border-white/10 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center text-[#002B5B] font-black text-sm">
            26
          </div>
          <h1 className="text-lg md:text-xl font-black tracking-tighter uppercase hidden sm:block">Sticker Studio 2026</h1>
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold opacity-80">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="px-4 py-1.5 border border-white/20 hover:bg-white/10 rounded-full text-white text-xs uppercase tracking-wider transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col md:flex-row md:overflow-hidden">
        
        {/* Left Column: Editor */}
        <section className="w-full md:w-[400px] lg:w-[450px] shrink-0 md:overflow-y-auto bg-[#001D3D]/50 md:border-r border-t md:border-t-0 border-white/10 p-5 lg:p-6 space-y-6 custom-scrollbar">
          <div className="bg-[#001D3D]/50 rounded-xl shadow-sm border border-white/10 p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFD700] mb-4 flex items-center gap-2">
              <Upload size={18} className="opacity-60" />
              1. Enviar Foto
            </h2>
            
            <div className="flex flex-col gap-4">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full relative py-8 border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex flex-col items-center justify-center gap-3"
              >
                {image ? (
                  <>
                    <RefreshCw size={24} className="text-[#FFD700]" />
                    <span className="text-sm font-medium opacity-60 text-white">Trocar Foto</span>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="opacity-40 text-white" />
                    <span className="text-xs font-medium opacity-60 text-white max-w-[200px] text-center">Clique para selecionar uma foto do seu dispositivo</span>
                    <span className="text-[10px] opacity-40 max-w-[200px] text-center">Recomendado: PNG com fundo transparente</span>
                  </>
                )}
              </button>
              {image && (
                <button 
                  onClick={() => setImage(null)}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-center"
                >
                  Remover Foto
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#001D3D]/50 rounded-xl shadow-sm border border-white/10 p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFD700] mb-4 flex items-center gap-2">
              <Settings size={18} className="opacity-60" />
              2. Personalizar Informações
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Nome do Jogador</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FFD700] text-white"
                />
              </div>
              
              <div>
                <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Data de Nascimento</label>
                <input 
                  type="text" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FFD700] text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Altura</label>
                  <input 
                    type="text" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FFD700] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Peso</label>
                  <input 
                    type="text" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FFD700] text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Detalhes do Time</label>
                <input 
                  type="text" 
                  value={team} 
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FFD700] text-white placeholder-white/40"
                  placeholder="ex: PALMEIRAS (BRA)"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Código do País (Vertical)</label>
                <input 
                  type="text" 
                  value={country} 
                  maxLength={3}
                  onChange={(e) => setCountry(e.target.value.toUpperCase())}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FFD700] text-white uppercase"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#001D3D]/50 rounded-xl shadow-sm border border-white/10 p-6">
             <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFD700] mb-4">3. Aparência</h2>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Fundo Superior</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={topBg} onChange={(e) => setTopBg(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent" />
                    <span className="text-xs text-white/80 uppercase tabular-nums">{topBg}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Fundo Inferior</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={footerBg} onChange={(e) => setFooterBg(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent" />
                    <span className="text-xs text-white/80 uppercase tabular-nums">{footerBg}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 mb-1 uppercase tracking-wide">Borda Clássica (Cor)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={borderColor} onChange={(e) => { setBorderColor(e.target.value); setFrameStyle('classic'); }} className="w-8 h-8 rounded border-none cursor-pointer p-0 bg-transparent" />
                    <span className="text-xs text-white/80 uppercase tabular-nums">{borderColor}</span>
                  </div>
                </div>
                <div className="col-span-2 mt-2">
                  <label className="block text-[10px] text-white/50 mb-2 uppercase tracking-wide">Estilo da Moldura</label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setFrameStyle('classic')}
                      className={`w-10 h-10 rounded-full border-[3px] transition-all ${frameStyle === 'classic' ? 'border-[#FFD700] ring-4 ring-white/10' : 'border-transparent ring-2 ring-white/20'}`}
                      style={{ backgroundColor: borderColor }}
                      title="Clássica"
                    />
                    <button 
                      onClick={() => setFrameStyle('golden')}
                      className={`w-10 h-10 rounded-full border-[3px] transition-all ${frameStyle === 'golden' ? 'border-[#FFD700] ring-4 ring-white/10' : 'border-transparent ring-2 ring-white/20'}`}
                      style={{ background: 'linear-gradient(135deg, #FFF0A8 0%, #D4AF37 25%, #AA771C 50%, #D4AF37 75%, #FFF0A8 100%)' }}
                      title="Dourada"
                    />
                    <button 
                      onClick={() => setFrameStyle('festive')}
                      className={`w-10 h-10 rounded-full border-[3px] transition-all ${frameStyle === 'festive' ? 'border-[#FFD700] ring-4 ring-white/10' : 'border-transparent ring-2 ring-white/20'}`}
                      style={{ background: 'linear-gradient(45deg, #E30A17, #FFCE00, #009B3A, #002776)' }}
                      title="Festiva"
                    />
                    <button 
                      onClick={() => setFrameStyle('neon')}
                      className={`w-10 h-10 rounded-full border-[3px] transition-all ${frameStyle === 'neon' ? 'border-[#FFD700] ring-4 ring-white/10' : 'border-transparent ring-2 ring-white/20'}`}
                      style={{ background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)' }}
                      title="Neon"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input 
                      type="checkbox" 
                      checked={showWatermark} 
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-[#FFD700] focus:ring-[#FFD700]"
                    />
                    <span className="text-xs font-medium text-white/80">Mostrar Números</span>
                  </label>
                </div>
             </div>
          </div>
        </section>

        {/* Right Column: Preview */}
        <section className="flex-1 flex flex-col items-center p-6 md:p-4 bg-[#002B5B] relative md:overflow-hidden">
          <div className="flex flex-col items-center w-full md:max-h-full md:overflow-y-auto py-2 md:py-4 custom-scrollbar">
            <div className="w-full max-w-[340px] md:max-w-[380px] lg:max-w-[420px] mb-4 flex justify-between items-end shrink-0">
               <h2 className="text-xs font-bold uppercase tracking-wider text-[#FFD700]">Pré-visualização da Figurinha</h2>
               <span className="text-[10px] text-white/40 uppercase tracking-widest">Tamanho Real</span>
            </div>
            
            {/* STICKER CANVAS */}
            {/* The ref is attached here for html-to-image */}
            <div 
              ref={stickerRef}
              className="relative w-full max-w-[340px] md:max-w-[380px] lg:max-w-[420px] aspect-[1/1.4] shadow-2xl rounded-[4px] overflow-hidden flex flex-col select-none shrink-0"
              style={{ padding: '8px', ...getFrameStyle() }}
            >
              {/* Inner frame */}
              <div className="relative flex-1 w-full flex flex-col overflow-hidden rounded-[2px]" style={{ backgroundColor: topBg }}>
                
                {/* 1. Watermark "26" Background */}
                {showWatermark && (
                  <div className="absolute inset-x-0 top-6 bottom-32 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 200 250" className="w-[180%] h-[180%] opacity-90 -translate-x-[15%] -translate-y-[10%]" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
                      <text x="0" y="100" fontSize="140" fill="#009B3A" fontWeight="900" transform="scale(1.3, 1)">2</text>
                      <text x="35" y="180" fontSize="140" fill="#009B3A" fontWeight="900" transform="scale(1.3, 1)">6</text>
                      <text x="0" y="100" fontSize="140" fill="#FED100" fontWeight="900" clipPath="url(#intersect)" transform="scale(1.3, 1)">2</text>
                      <clipPath id="intersect">
                         <text x="35" y="180" fontSize="140" fontWeight="900" transform="scale(1.3, 1)">6</text>
                      </clipPath>
                    </svg>
                  </div>
                )}

                {/* 2. Photo Layer */}
                {image ? (
                  <>
                    <img src={image} alt="Player" className="absolute inset-x-0 bottom-12 w-full h-[90%] object-cover object-bottom z-10" />
                  </>
                ) : (
                  <div className="absolute inset-x-0 top-0 w-full h-full flex flex-col items-center justify-center text-white/40 z-10 bg-black/5">
                    <Camera size={64} opacity={0.5} />
                    <span className="text-sm font-medium mt-2">Sem Foto</span>
                  </div>
                )}

                {/* 3. Top Right FIFA Logo Container */}
                <div className="absolute top-4 right-4 w-10 h-14 bg-white rounded-t-2xl rounded-b-md flex flex-col items-center justify-between py-1 z-20 shadow-md">
                  <div className="relative w-full flex-1 flex flex-col items-center justify-center">
                    <div className="font-black text-[#dcdcdc] flex flex-col leading-[0.75] text-[16px] tracking-tighter w-full text-center">
                      <span className="pr-2">2</span>
                      <span className="pl-2">6</span>
                    </div>
                    {/* Subtle Generic Trophy Shape */}
                    <div className="absolute inset-0 flex items-center justify-center top-1">
                      <div className="w-[12px] h-[18px] bg-gradient-to-b from-[#EED05E] via-[#FCE986] to-[#B07B18] z-10 shadow-sm drop-shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' }} />
                    </div>
                  </div>
                  <span className="text-[#002776] font-black text-[8px] tracking-tighter mt-1">FIFA</span>
                </div>

                {/* 4. Right Edge: Country & Flag */}
                <div className="absolute bottom-[20%] right-3 z-20 flex flex-col items-center gap-1 w-10">
                  {/* Flag Container (Teardrop shape approximation) */}
                  <div className="w-[36px] h-[36px] rounded-t-full rounded-bl-full rounded-br-[8px] border-[3px] border-white overflow-hidden shadow-md bg-[#009b3a] flex items-center justify-center relative z-10">
                    {/* Inner Circle Flag */}
                    <div className="w-full h-full rounded-full border border-white/40 flex items-center justify-center bg-[#009b3a] overflow-hidden">
                      {/* Fake Brazil flag items */}
                      <div className="w-4 h-4 bg-[#fed100] rotate-45 flex items-center justify-center">
                        <div className="w-[8px] h-[8px] bg-[#002776] rounded-full" />
                      </div>
                    </div>
                  </div>
                  {/* Letters (Overlapping vertically) */}
                  <div className="flex flex-col items-center relative z-0 mt-0.5">
                    {country.split('').slice(0, 3).map((letter, i) => (
                      <span 
                        key={i} 
                        className="text-[34px] font-black text-transparent" 
                        style={{ 
                          WebkitTextStroke: '2.5px white',
                          lineHeight: '0.8',
                          letterSpacing: '-1px',
                          fontFamily: 'Arial Black, Impact, sans-serif'
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Bottom Stats Box */}
                <div className="absolute font-sans bottom-3 left-4 right-[60px] z-30 flex flex-col gap-1.5">
                  {/* Floating Name/Stats Pill */}
                  <div 
                    className="rounded-full px-4 pt-1.5 pb-2 flex flex-col items-center shadow-md w-full"
                    style={{ backgroundColor: footerBg }}
                  >
                    <h2 className="text-[20px] font-black uppercase text-white leading-none tracking-tight pt-0.5" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>
                      {name || 'NOME DO JOGADOR'}
                    </h2>
                    <div className="text-[10px] font-normal text-white/95 leading-none mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {dob} | {height} | {weight}
                    </div>
                  </div>
                  
                  {/* Footer Stats / Logos */}
                  <div className="flex gap-1.5 h-[24px] w-full">
                    <div 
                      className="flex-1 rounded-full flex items-center justify-center text-white text-[11px] font-bold uppercase tracking-wider overflow-hidden shadow-md px-2"
                      style={{ backgroundColor: footerBg }}
                    >
                      {team || 'INFORMAÇÃO DO TIME'}
                    </div>
                    {/* Fake Panini label */}
                    <div className="w-[64px] bg-[#FFE600] rounded-sm flex items-center justify-center shadow-md border-[0.5px] border-black/10 shrink-0">
                      <span className="text-[#E30A17] text-[9px] font-black uppercase tracking-tighter" style={{ fontFamily: 'Arial Black, sans-serif' }}>PANINI</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 w-full max-w-[340px] md:max-w-[380px] lg:max-w-[420px] flex flex-col gap-3 shrink-0">
              <button
                onClick={downloadSticker}
                className="w-full py-4 px-6 bg-[#FFD700] text-[#002B5B] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                <Download size={24} />
                Baixar Imagem
              </button>

              {typeof navigator !== 'undefined' && !!navigator.share && (
                <button
                  onClick={shareSticker}
                  className="w-full py-4 px-6 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                  <Share2 size={24} />
                  Compartilhar Figurinha
                </button>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

