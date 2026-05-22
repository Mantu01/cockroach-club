import { Bug } from 'lucide-react';

interface LoaderProps {
  fullscreen?: boolean;
}

function Loader({ fullscreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inset-0 rounded-full border-[3px] border-[#b5451b]/20 border-t-[#b5451b] animate-spin" />

        <div className="absolute w-16 h-16 rounded-full bg-[#b5451b]/10 blur-xl" />

        <Bug className="relative z-10 size-8 text-[#b5451b]" />
      </div>

      <div className="flex items-center gap-1 select-none">
        <span
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="font-black text-2xl tracking-tight uppercase text-white"
        >
          Cockroach
          <span className="text-[#b5451b]">Club</span>
        </span>
      </div>

      <span
        style={{ fontFamily: "'Syne', sans-serif" }}
        className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted-foreground animate-pulse"
      >
        Crawling the system...
      </span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-black">
      {content}
    </div>
  );
}

export default Loader;