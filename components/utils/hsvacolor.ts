import { hsvToHsl, hsvToRgb, hsvToCmyk, hsvToHex } from './color';

/**
 * (array: Number[]): string
 * 
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 * 
 */
interface NextCovertor {
    (array: Number[]): string;
}
export function HSVaColor(h: number = 0, s: number = 0, v: number = 0, a: number = 1) {
    const mapper = (original: Number[], next: NextCovertor) => (precision = 0) => {
        return next(~precision ? original.map((v) => Number(v.toFixed(precision))) : original);
    };

    const that = {
        h, s, v, a,

        toHSVA() {
            const hsva = [that.h, that.s, that.v, that.a];
            hsva.toString = mapper(hsva, (arr: number[]) => `hsva(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsva;
        },

        toHSLA() {
            const hsla = [...hsvToHsl(that.h, that.s, that.v), that.a];
            hsla.toString = mapper(hsla, (arr: number[]) => `hsla(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsla;
        },

        toRGBA() {
            const rgba = [...hsvToRgb(that.h, that.s, that.v), that.a];
            rgba.toString = mapper(rgba, (arr: number[]) => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${that.a})`);
            return rgba;
        },

        toCMYK() {
            const cmyk = hsvToCmyk(that.h, that.s, that.v);
            cmyk.toString = mapper(cmyk, (arr: number[]) => `cmyk(${arr[0]}%, ${arr[1]}%, ${arr[2]}%, ${arr[3]}%)`);
            return cmyk;
        },

        toHEXA() {
            const hex = hsvToHex(that.h, that.s, that.v);

            // Check if alpha channel make sense, convert it to 255 number space, convert
            // to hex and pad it with zeros if needet.
            const alpha = that.a >= 1 ? '' : Number((that.a * 255).toFixed(0))
                .toString(16)
                .toUpperCase().padStart(2, '0');

            alpha && hex.push(alpha);
            hex.toString = () => `#${hex.join('').toUpperCase()}`;
            return hex;
        },

        clone: () => HSVaColor(that.h, that.s, that.v, that.a)
    };

    return that;
}