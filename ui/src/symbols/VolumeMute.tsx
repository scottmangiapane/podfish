import type { TSymbolProps } from "@/types/symbol";

function VolumeMute({ onClick, fill }: TSymbolProps) {
  return (
    <svg className="btn symbol" onClick={ onClick } xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={ fill || "var(--text-color)" }><path d="M280-360v-240h160l200-200v640L440-360H280Zm80-80h114l86 86v-252l-86 86H360v80Zm100-40Z"/></svg>
  )
}

export default VolumeMute;
