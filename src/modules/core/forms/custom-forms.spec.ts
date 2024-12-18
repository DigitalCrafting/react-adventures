import {describe, expect, it} from 'vitest';
import {FormGroup, FormInputControl} from "./custom-forms.ts";

describe('Custom forms', () => {
    describe('FormInput', () => {
        it('should correctly store value', () => {
            // given
            const control = new FormInputControl('test')

            // when
            const actual = control.getValue()

            // then
            expect(actual).eq('test')
        })

        it('should correctly set value and emit event', () => {
            // given
            const control = new FormInputControl('test');
            let emittedValue = null;
            control.onValueChanges((value) => {
                emittedValue = value
            })

            // when
            control.setValue('test 2')
            const actual = control.getValue();

            // then
            expect(actual).eq('test 2');
            expect(emittedValue).eq('test 2');
        })

        it('should correctly set value and NOT emit event', () => {
            // given
            const control = new FormInputControl('test');
            let emittedValue = null;
            control.onValueChanges((value) => {
                emittedValue = value
            })

            // when
            control.setValue('test 2', {emit: false})
            const actual = control.getValue();

            // then
            expect(actual).eq('test 2');
            expect(emittedValue).eq(null);
        })
    })

    describe('FormGroup', () => {
        it('should correctly store value', () => {
            // given
            const control = new FormGroup({
                first: new FormInputControl('first value'),
                second: new FormInputControl('second value')
            })

            // when
            const actual = control.getValue()

            // then
            expect(JSON.stringify(actual)).eq(JSON.stringify({
                first: 'first value',
                second: 'second value'
            }))
        })

        it('should correctly set value in all sub-elements', () => {
            // given
            const control = new FormGroup({
                first: new FormInputControl('first value'),
                second: new FormInputControl('second value')
            })

            // when
            control.setValue({
                first: 'new first value',
                second: 'new second value'
            })
            const actual = control.getValue()

            // then
            expect(JSON.stringify(actual)).eq(JSON.stringify({
                first: 'new first value',
                second: 'new second value'
            }))
        })

        it('should correctly set value in specified sub-elements', () => {
            // given
            const control = new FormGroup({
                first: new FormInputControl('first value'),
                second: new FormInputControl('second value')
            })

            // when
            control.setValue({
                second: 'new second value'
            })
            const actual = control.getValue()

            // then
            expect(JSON.stringify(actual)).eq(JSON.stringify({
                first: 'first value',
                second: 'new second value'
            }))
        })

        it('should correctly emit value change event', () => {
            // given
            const control = new FormGroup({
                first: new FormInputControl('first value'),
                second: new FormInputControl('second value')
            })
            let emittedValue = null
            control.onValueChanges((value) => {
                emittedValue = value
            })

            // when
            control.setValue({
                second: 'new second value'
            })

            // then
            expect(JSON.stringify(emittedValue)).eq(JSON.stringify({
                first: 'first value',
                second: 'new second value'
            }))
        })

        it('should correctly emit and bubble-up value change event', () => {
            // given
            const control = new FormGroup({
                first: new FormInputControl('first value'),
                second: new FormInputControl('second value')
            })
            let emittedValue = null
            control.onValueChanges((value) => {
                emittedValue = value
            })

            // when
            const secondControl = control.getFormElement('second')
            secondControl.setValue('new second value')

            // then
            expect(JSON.stringify(emittedValue)).eq(JSON.stringify({
                first: 'first value',
                second: 'new second value'
            }))
        })

        it('should emit but NOT bubble-up value change event', () => {
            // given
            const control = new FormGroup({
                first: new FormInputControl('first value'),
                second: new FormInputControl('second value')
            })
            const secondControl = control.getFormElement('second')
            let emittedValue = null
            secondControl.onValueChanges((value) => {
                emittedValue = value
            })
            let bubbledUpValue = null
            control.onValueChanges((value) => {
                bubbledUpValue = value
            })

            // when
            secondControl.setValue('new second value', {emit: true, bubbleUp: false})

            // then
            expect(emittedValue).eq('new second value')
            expect(bubbledUpValue).eq(null)
        })
    })
})