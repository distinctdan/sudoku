module Sudoku.Utils {
    'use strict';

    export function randomRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    export function unionRects(a: IRect, b: IRect): IRect {
        return {
            x1: Math.min(a.x1, a.x2, b.x1, b.x2),
            y1: Math.min(a.y1, a.y2, b.y1, b.y2),
            x2: Math.max(a.x1, a.x2, b.x1, b.x2),
            y2: Math.max(a.y1, a.y2, b.y1, b.y2)
        };
    }

    export function copyRect(a: IRect): IRect {
        return {x1: a.x1, y1: a.y1, x2: a.x2, y2: a.y2};
    }

    export function getRectArea(a: IRect): number {
        return Math.abs((a.x2 - a.x1) * (a.y2 - a.y1));
    }

    export function rectOverlapsRect(a: IRect, b: IRect): boolean {
        // If any right edge is too right of the left, it can't intersect
        if (b.x1 > a.x2) return false;
        if (b.x2 < a.x1) return false;
        if (b.y2 < a.y1) return false;
        if (b.y1 > a.y2) return false;
        return true;
    }

    export function rectAContainsRectB(a: IRect, b: IRect): boolean {
        if (b.x1 < a.x1) return false;
        if (b.x1 > a.x2) return false;
        if (b.x2 < a.x1) return false;
        if (b.x2 > a.x2) return false;
        if (b.y1 < a.y1) return false;
        if (b.y1 > a.y2) return false;
        if (b.y2 < a.y1) return false;
        if (b.y2 > a.y2) return false;
        return true;
    }

    // Maps a value in an input range to it's equivalent in an output range
    // So, given 15 from 10 to 20, with an output range of 40 to 80, it outputs 60
    export function mapValue(val: number, inStart: number, inEnd: number, outStart: number, outEnd:number): number {
        let denom1 = inEnd - inStart;
        // this is what percentage the input value is of the input range
        let inPercent = 0;
        if (denom1 == 0) inPercent = 0;
        else inPercent = (val - inStart) / (denom1);
        
        return (inPercent * (outEnd - outStart)) + outStart;
    }

    export function mapColor(val, inStart, inEnd, startColor, endColor) {
        let startColorRGB = Utils.hexToRGB(startColor);
        let endColorRGB = Utils.hexToRGB(endColor);

        let mix = Utils.mapValue(val, inStart, inEnd, 0, 1);
        mix = Math.min(1, Math.max(0, mix));

        return Utils.rgbToHex(
            startColor.r * (1 - mix) + endColor.r * mix,
            startColor.g * (1 - mix) + endColor.g * mix,
            startColor.b * (1 - mix) + endColor.b * mix,
        );
    }

    export function hexToRGB(hex: number): IColor {
        return {
            r: ((hex & 0xFF0000) >> 16) / 255,
            g: ((hex & 0x00FF00) >> 8) / 255,
            b: (hex & 0x0000FF) / 255
        }
    }

    // Expects numbers between 0 and 1, outputs hex number
    export function rgbToHex(r: number, g: number, b: number): number {
        return ((Math.floor(r * 255) << 16) + (Math.floor(g * 255) << 8) + (Math.floor(b * 255)));
        // console.log("in, out: ", r, g, b, componentToHex(r) + componentToHex(g) + componentToHex(b), parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16))
        // return parseInt(componentToHex(r) + componentToHex(g) + componentToHex(b), 16);
    }

    // Expects a number between 0 and 1
    export function componentToHex(color: number): string {
        let hex = (Math.floor(color * 255)).toString(16);
        return hex.length == 1  ? '0' + hex : hex;
    }

    //returns the minimum angle (in radians) between 2 vectors
    export function angleBetweenVectors(v1: Float32Array, v2: Float32Array): number {
        let h1 = Utils.getHeadingFromVector(v1) + Math.PI,
            h2 = Utils.getHeadingFromVector(v2) + Math.PI; //get the vectors headings and offset them so they are between 0 and 2PI
        //make sure h1 is the larger number
        if(h1 < h2){
            let temp = h1;
            h1 = h2;
            h2 = temp;
        }
        //there are 2 ways to calculate the angle between 2 vectors around a circle:
        //1) subtract the larger from the smaller (the clockwise method)
        //2) find the angle from the larger to the x axis and add it to the smaller
        return Math.min(h1 - h2, ((2 * Math.PI) - h1) + h2);
    }

    // Returns the heading in radians
    export function getHeadingFromVector(v: Float32Array): number {
        return Math.atan2(v[1], v[0])
    }
}