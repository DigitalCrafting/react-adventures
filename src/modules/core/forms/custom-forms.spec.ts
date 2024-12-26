import {describe, expect, it} from 'vitest';
import {FormArray, FormGroup, FormInputControl} from "./custom-forms.ts";
import {ValidatorComposers} from "../validators/validators.ts";

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

        it('should validate field and emit event', () => {
            // given
            const control = new FormInputControl('', ValidatorComposers.string().required())
            let currentIsValid = control.getIsValid()
            control.onValidityChanges((valid) => {
                currentIsValid = valid
            })

            // when
            control.setValue('test')

            // then
            expect(currentIsValid).eq(control.getIsValid())
            expect(currentIsValid).eq(true)
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
            const secondControl = control.getElement('second') as FormInputControl
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
            const secondControl = control.getElement('second') as FormInputControl
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

        it('should correctly validate and emit value', () => {
            // given
            const control = new FormGroup({
                first: new FormInputControl('', ValidatorComposers.string().required()),
                second: new FormInputControl('second value')
            })
            let currentIsValid = control.getIsValid()
            control.onValidityChanges((valid) => {
                currentIsValid = valid
            })
            expect(currentIsValid).eq(false)

            // when
            control.setValue({first: 'test'})

            // then
            expect(currentIsValid).eq(true)
            expect(currentIsValid).eq(control.getIsValid())
        })
    })

    describe('FormArray', () => {
        it('should correctly store value', () => {
            // given
            const control = new FormArray([
                new FormInputControl('first value', ValidatorComposers.string().required()),
                new FormInputControl('second value')
            ])
            const expectedValue = ['first value', 'second value'];

            // when
            const actualValue = control.getValue();

            // then
            expect(actualValue.sort()).toEqual(expectedValue.sort())
        })

        it('should correctly set value in all sub-elements', () => {
            // given
            const control = new FormArray([
                new FormInputControl('first value', ValidatorComposers.string().required()),
                new FormInputControl('second value')
            ])
            const expectedValue = ['new first value', 'new second value'];

            // when
            control.setValue(expectedValue)
            const actualValue = control.getValue();

            // then
            expect(actualValue.sort()).toEqual(expectedValue.sort())
        })

        it('should correctly emit and bubble-up value change event', () => {
            // given
            const control = new FormInputControl('first value', ValidatorComposers.string().required());
            const controlArray = new FormArray([
                control,
                new FormInputControl('second value')
            ])
            let actualValue: string[] | null = null
            controlArray.onValueChanges((value) => {
                actualValue = value
            })
            const expectedValue = ['new first value', 'second value'];

            // when
            control.setValue('new first value')

            // then
            expect(actualValue).not.toBe(null)
            // @ts-ignore
            expect(actualValue.sort()).toEqual(expectedValue.sort())
        })

        it('should emit but NOT bubble-up value change event', () => {
            // given
            const control = new FormInputControl('first value', ValidatorComposers.string().required());
            const controlArray = new FormArray([
                control,
                new FormInputControl('second value')
            ])
            let controlEmitted = false
            let arrayEmitted = false
            control.onValueChanges(() => {
                controlEmitted = true
            })
            controlArray.onValueChanges(() => {
                arrayEmitted = true
            })

            // when
            control.setValue('new first value', {emit: true, bubbleUp: false})

            // then
            expect(controlEmitted).eq(true)
            expect(arrayEmitted).eq(false)
        })

        it('should correctly validate and emit value', () => {
            // given
            const controlArray = new FormArray([
                new FormInputControl('', ValidatorComposers.string().required()),
                new FormInputControl('second value')
            ])
            const initialValid = controlArray.getIsValid()

            let emittedValid = false
            controlArray.onValidityChanges((isValid) => {
                emittedValid = isValid
            })

            // when
            controlArray.getElement<FormInputControl>(0).setValue('new first value', {emit: true, bubbleUp: false})
            const currentValid = controlArray.getIsValid()

            // then
            expect(initialValid).eq(false);
            expect(currentValid).eq(true);
            expect(emittedValid).eq(true);
        })

        describe('removeElement', () => {
            it('should correctly remove element', () => {
                // given
                const controlArray = new FormArray([
                    new FormInputControl('', ValidatorComposers.string().required()),
                    new FormInputControl('second value')
                ])

                // when
                controlArray.removeElement(0)

                // then
                expect(controlArray.length).eq(1)
            })

            it('should correctly update and emit value change', () => {
                // given
                const controlArray = new FormArray([
                    new FormInputControl('', ValidatorComposers.string().required()),
                    new FormInputControl('second value')
                ])
                const oldValue = controlArray.getValue()
                let emittedValue: any[] | null = null

                controlArray.onValueChanges((value) => {
                    emittedValue = value
                })
                const expectedValue = ['second value'];

                // when
                controlArray.removeElement(0)

                // then
                expect(oldValue.sort()).not.toEqual(expectedValue)
                expect(emittedValue).not.eq(null)
                // @ts-ignore
                expect(emittedValue).toEqual(expectedValue)
                expect(controlArray.getValue().sort()).toEqual(expectedValue)
            })

            it('should correctly update and emit validity change', () => {
                // given
                const controlArray = new FormArray([
                    new FormInputControl('', ValidatorComposers.string().required()),
                    new FormInputControl('second value')
                ])

                const currentValidity = controlArray.getIsValid()
                let emittedValidity: boolean | null = null
                controlArray.onValidityChanges((isValid) => {
                    emittedValidity = isValid
                })

                // when
                controlArray.removeElement(0)

                // then
                expect(currentValidity).toBe(false);
                expect(emittedValidity).toBe(true);
                expect(controlArray.getIsValid()).toBe(true);
            })
        })
    })
})