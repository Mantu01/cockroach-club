import { Bug } from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <Bug className="size-5 text-[#b5451b]" />
      <span
        style={{ fontFamily: "'Syne', sans-serif" }}
        className="font-black text-lg tracking-tighter uppercase"
      >
        Cockroach<span className="text-[#b5451b]">Club</span>
      </span>
    </div>
  );
}

export default Logo;
