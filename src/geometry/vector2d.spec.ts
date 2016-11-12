/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import { expect } from 'chai';

import { Vector2 } from './index';

describe('Vector2', () => {
    it('Should be truthy', () => {
        let truty = true;
        expect(truty).to.be.equal(true);
    });

    it('Should create a 0.0 2d Vector', () => {
        let vector = new Vector2(0, 0);
        expect(vector.x).to.be.equal(0.0);
        expect(vector.y).to.be.equal(0.0);
    });

    it('Should return a inverted vector', () => {
        let vector = new Vector2(1, 1);
        let inverted = vector.invert();

        expect(inverted.x).to.be.equal(-1);
        expect(inverted.y).to.be.equal(-1);
    });
});
