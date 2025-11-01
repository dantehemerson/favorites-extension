// https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports
declare module "*.css" {}

declare module "color-hash" {
  export default class ColorHash {
    constructor(
      options: {
        lightness?: number | number[];
        saturation?: number | number[];
        hue?:
          | number
          | { max: number; min: number }
          | { max: number; min: number }[];
        hash?: string | ((str: string) => number);
      } = {}
    );

    hsl(str: string): [number, number, number];
    hex(str: string): string;
  }
}
