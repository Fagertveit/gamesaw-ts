import { PI } from './util';

export function degreeToRadian(degree: number): number {
    return degree * (PI / 180);
}

export function radianToDegree(radian: number): number {
    return radian * (180 / PI);
}
