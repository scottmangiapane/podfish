import type { TSymbolProps } from "@/types/symbol";

function ArrowUp({ onClick, fill }: TSymbolProps) {
  return (
    <svg className="btn symbol" onClick={ onClick } xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={ fill || "var(--text-color)" }><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>
  )
}

export default ArrowUp;
