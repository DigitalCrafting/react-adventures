import {describe, expect, it} from 'vitest';
import {EventEmitter} from "./event-emitter.ts";

describe('Event emitter', ()=> {
    it('should correctly emit event', () => {
        let testValue = 0;
        const numberEventEmitter = new EventEmitter<number>();

        numberEventEmitter.subscribe((value) => {
            testValue = value
        })

        numberEventEmitter.emit(5)

        expect(testValue).eq(5)
    });

    it('should correctly unsubscribe', () => {
        let testValue = 0;
        const numberEventEmitter = new EventEmitter<number>();

        const subscription = numberEventEmitter.subscribe((value) => {
            testValue = value
        })

        subscription.unsubscribe();
        numberEventEmitter.emit(5)

        expect(testValue).eq(0)
    })
})