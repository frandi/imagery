// Ambient module declarations for dependencies that ship without TypeScript types.

declare module 'to-ico' {
  function toIco(
    input: Buffer | Buffer[],
    options?: { resize?: boolean; sizes?: number[] }
  ): Promise<Buffer>;
  export default toIco;
}

declare module 'potrace' {
  interface PotraceOptions {
    color?: string;
    background?: string;
    threshold?: number;
    optCurve?: boolean;
    optTolerance?: number;
    turdSize?: number;
    turnPolicy?: string;
    alphaMax?: number;
    blackOnWhite?: boolean;
  }

  type TraceCallback = (err: Error | null, svg: string) => void;

  export function trace(
    file: Buffer | string,
    options: PotraceOptions,
    callback: TraceCallback
  ): void;

  export function posterize(
    file: Buffer | string,
    options: PotraceOptions,
    callback: TraceCallback
  ): void;
}
