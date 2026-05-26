import { ArrowRight, Download, Sparkles, Sticker, WandSparkles } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const benefits = [
  {
    icon: Sticker,
    title: 'Personalize em poucos cliques',
    description: 'Envie sua foto, ajuste nome, time e dados e gere uma figurinha pronta para publicar.',
  },
  {
    icon: WandSparkles,
    title: 'Escolha o acabamento',
    description: 'Aplique molduras especiais e transforme a peça em um card com presença premium.',
  },
  {
    icon: Download,
    title: 'Compartilhe em qualquer canal',
    description: 'Baixe a imagem e compartilhe onde quiser.',
  },
];

const steps = [
  'Escolha sua foto e seus dados',
  'Ajuste o estilo da figurinha',
  'Baixe e compartilhe sua peça personalizada',
];

export function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, configError, loginWithGoogle } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      const nextPath =
        typeof location.state === 'object' && location.state && 'from' in location.state
          ? String(location.state.from)
          : '/dashboard';
      navigate(nextPath, { replace: true });
    } catch (error) {
      console.error('Falha ao autenticar com Google.', error);
      alert('Não foi possível iniciar o acesso agora. Tente novamente em instantes.');
    }
  };

  return (
    <div className="min-h-screen bg-[#002B5B] text-white">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[#002B5B]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(0,0,0,0.18)_0%,transparent_18%,transparent_82%,rgba(0,0,0,0.18)_100%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-[1480px] flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <img src="/icon.png" alt="WC 2026 Sticker Maker" className="h-14 w-auto" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#FFD700]/80">WC26 Sticker Maker</p>
                <h1 className="text-xl font-black uppercase tracking-[-0.06em] text-white sm:text-2xl">
                  Sticker Studio
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{ cursor: 'pointer' }}
              disabled={loading || Boolean(configError)}
              className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white/10 md:block disabled:cursor-not-allowed disabled:opacity-55"
            >
              Já tenho acesso
            </button>
          </header>

          <main className="grid flex-1 gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-center lg:py-0">
            <section className="relative lg:pl-14">
              <div className="max-w-3xl">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#FFD700]/82">
                  Crie e compartilhe suas figurinhas em minutos
                </p>
                <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.08em] text-white sm:text-6xl lg:text-7xl">
                  Colecione suas figurinhas da copa do mundo 2026.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                  Crie figurinhas com visual oficial, acabamento especial e compartilhamento imediato para
                  redes sociais.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  style={{ cursor: 'pointer' }}
                  onClick={handleGoogleLogin}
                  disabled={loading || Boolean(configError)}
                  className="inline-flex items-center gap-3 rounded-full bg-[#FFD700] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#002B5B] transition hover:bg-[#ffe066] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002B5B] text-[#FFD700]">
                    <Sparkles size={16} />
                  </span>
                  {loading ? 'Carregando acesso...' : 'Criar minha figurinha'}
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  style={{ cursor: 'pointer' }}
                  onClick={handleGoogleLogin}
                  disabled={loading || Boolean(configError)}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  Já tenho acesso
                </button>
              </div>

              {configError ? (
                <div className="mt-5 max-w-2xl border border-red-400/35 bg-red-500/10 px-5 py-4 text-sm leading-6 text-red-100">
                  O acesso ainda não está configurado para este ambiente. Finalize as credenciais do projeto para
                  liberar o uso.
                </div>
              ) : null}

              <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
                {benefits.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="max-w-sm border-t border-white/12 pt-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center border border-[#FFD700]/35 bg-[#FFD700] text-[#002B5B]">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.08em] text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="relative">
              <div className="border border-white/12 bg-[#001D3D] px-7 py-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.16)]">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#FFD700]">
                      Plataforma criativa
                    </p>
                    <h3 className="mt-4 text-3xl font-black uppercase tracking-[-0.06em]">
                      Uma experiência de criação única.
                    </h3>
                  </div>
                  <img src="/icon.png" alt="WC 2026 Sticker Maker" className="hidden h-16 w-auto sm:block" />
                </div>

                <p className="mt-5 max-w-md text-sm leading-6 text-white/72">
                  Entre no clima da Copa do Mundo de 2026.
                </p>

                <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/12 bg-white/5 text-sm font-black text-[#FFD700]">
                        0{index + 1}
                      </span>
                      <p className="text-sm font-medium text-white/86">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 border border-white/10 bg-white/5 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Resultado final</p>
                  <p className="mt-2 text-lg font-black uppercase tracking-[-0.04em]">
                    Visual premium, figurinha pronta para compartilhar e colecionar.
                  </p>
                </div>
              </div>
            </aside>
          </main>

          <section className="border-t border-white/10 py-8">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#FFD700]/82">Pronto para compartilhar</p>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em] text-white sm:text-4xl">
                  Crie sua primeira figurinha com um clique.
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/68 sm:text-base">
                  Entre agora, personalize a figurinha da sua maneira.
                </p>
              </div>

              <button
                type="button"
                style={{ cursor: 'pointer' }} 
                onClick={handleGoogleLogin}
                disabled={loading || Boolean(configError)}
                className="inline-flex items-center gap-3 rounded-full bg-[#FFD700] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#002B5B] transition hover:bg-[#ffe066] disabled:cursor-not-allowed disabled:opacity-55"
              >
                Criar minha figurinha
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
