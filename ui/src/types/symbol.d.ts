type TSize = "md" | "lg";

export interface TSymbolProps {
    onClick?: () => void;
    fill?: string;
    size?: TSize;
}

export interface TResizableSymbolProps {
    onClick?: () => void;
    fill?: string;
    size?: TSize;
}
