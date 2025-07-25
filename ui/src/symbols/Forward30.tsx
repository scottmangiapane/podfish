import type { TSymbolProps } from "@/types/symbol";

function Forward30({ onClick, fill }: TSymbolProps) {
  return (
    <svg className="btn symbol" onClick={ onClick } xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={ fill || "var(--text-color)" }><path d="M300-320v-60h100v-40h-60v-40h60v-40H300v-60h120q17 0 28.5 11.5T460-520v160q0 17-11.5 28.5T420-320H300Zm240 0q-17 0-28.5-11.5T500-360v-160q0-17 11.5-28.5T540-560h80q17 0 28.5 11.5T660-520v160q0 17-11.5 28.5T620-320h-80Zm20-60h40v-120h-40v120ZM480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800h6l-62-62 56-58 160 160-160 160-56-58 62-62h-6q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440h80q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg>
  )
}

export default Forward30;
