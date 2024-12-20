import {EventEmitter, EventEmitterCallback} from "../events/event-emitter.ts";
import {Subscription} from "rxjs";

export type ValidationError = string

export type ValidatorFunc = (value: any) => ValidationError | null

type EventConfig = {
    emit?: boolean,
    bubbleUp?: boolean
}

interface FormElement<T = never> {
    getIsValid(): boolean
    getError(): ValidationError | null
    onValidityChanges(callback: EventEmitterCallback): Subscription

    getValue(): T | T[]
    setValue(newValue: T | any, config?: EventConfig): void
    onValueChanges(callback: EventEmitterCallback): Subscription
}

abstract class BaseFormElement<T = never> implements FormElement<T> {
    protected parent: BaseFormElement | null = null;
    protected error: ValidationError | null;
    protected validatorFunc?: ValidatorFunc;
    protected validityChangesEventEmitter: EventEmitter<boolean>;
    protected valueChangesEventEmitter: EventEmitter<T | any>;

    constructor(validatorFunc?: ValidatorFunc) {
        this.validatorFunc = validatorFunc
        this.error = null;
        this.validityChangesEventEmitter = new EventEmitter();
        this.valueChangesEventEmitter = new EventEmitter();
    }


    getIsValid(): boolean {
        return this.error === null;
    }

    getError(): ValidationError | null {
        return this.error;
    }

    onValidityChanges(callback: EventEmitterCallback): Subscription {
        return this.validityChangesEventEmitter.subscribe(callback);
    }

    protected updateValidityAndEmitEvent(eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }) {
        if (this.validatorFunc) {
            const newError = this.validatorFunc(this.getValue());
            if (this.error !== newError) {
                this.error = newError;
                if (eventConfig.emit) {
                    this._emitValidityChanges()
                }
            }
        }
    }

    protected _emitValidityChanges(eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }) {
        if (eventConfig.emit) {
            this.validityChangesEventEmitter.emit(this.getIsValid())
            if (eventConfig.bubbleUp && this.parent) {
                this.parent._emitValidityChanges(eventConfig)
            }
        }
    }

    onValueChanges(callback: EventEmitterCallback): Subscription {
        return this.valueChangesEventEmitter.subscribe(callback);
    }

    protected _emitValueChanges(eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }) {
        if (eventConfig.emit) {
            this.valueChangesEventEmitter.emit(this.getValue())
            if (eventConfig.bubbleUp && this.parent) {
                this.parent._emitValueChanges(eventConfig)
            }
        }
    }

    protected _setParent(parent: BaseFormElement): void {
        this.parent = parent;
    }

    abstract getValue(): any;

    abstract setValue(newValue: T | T[], eventConfig?: EventConfig): void;
}

export class FormGroup extends BaseFormElement {
    private _formElements: {[key: string]: FormElement<any>}

    constructor(formElements: { [p: string]: FormElement<any> }, validator?: ValidatorFunc) {
        super(validator);
        this._formElements = formElements;
        this._setUpElements();
    }

    getIsValid(): boolean {
        let valid = true

        this._forEachChild((control) => {
            valid = valid && control.getIsValid()
        })

        return valid;
    }

    getValue(): any {
        const valueObject = {};

        this._forEachChild((control, key) => {
            const controlValue = control.getValue()
            // @ts-ignore
            valueObject[key] = controlValue

        })

        return valueObject;
    }

    setValue(newValue: any, eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }): void {
        for (const prop in newValue) {
            if (!Object.prototype.hasOwnProperty.call(this._formElements, prop)) {
                throw new Error("Value does not match FormGroup configuration")
            }
            this._formElements[prop].setValue(newValue[prop], {emit: true, bubbleUp: false});
        }

        this._emitValueChanges(eventConfig)
        this.updateValidityAndEmitEvent(eventConfig)
    }

    getFormElement(key: string) {
        return this._formElements[key]
    }

    // Internal
    private _forEachChild(cb: (v: any, k: any) => void): void {
        Object.keys(this._formElements).forEach((key) => {
            // The list of controls can change (for ex. controls might be removed) while the loop
            // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
            // have to null check before invoking the callback.
            const control = (this._formElements as any)[key];
            if (control) {
                cb(control, key);
            }
        });
    }

    private _setUpElements() {
        this._forEachChild((control) => {
            control._setParent(this)
        })
    }
}

export class FormInputControl<T = any> extends BaseFormElement<T> {
    private value: T;

    constructor(value: T, validator?: ValidatorFunc) {
        super(validator);
        this.value = value
        this.updateValidityAndEmitEvent({emit: false, bubbleUp: false})
    }

    getValue(): T {
        return this.value;
    }

    setValue(newValue: T, eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }): void {
        this.value = newValue;
        this._emitValueChanges(eventConfig)
        this.updateValidityAndEmitEvent(eventConfig)
    }
}

export class FormArray<T = never> extends BaseFormElement<T> {
    private formArray: FormElement[]

    constructor(array: FormElement[], validator?: ValidatorFunc) {
        super(validator);
        this.formArray = array || []
    }

    getValue(): T[] {
        const valueArray = [] as T[]

        for (const el of this.formArray) {
            valueArray.push(el.getValue() as T)
        }

        return valueArray;
    }

    setValue(newValue: T[], eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }): void {
        if (newValue.length != this.formArray.length) {
            throw new Error("Arrays lengths don't match")
        }

        for (let i = 0; i < newValue.length; i++) {
            // We don't want to 'bubbleUp' the event, since this control we emit change after the loop
            this.formArray[i].setValue(newValue[i], {emit: eventConfig.emit, bubbleUp: false});
        }

        this._emitValueChanges(eventConfig)
    }
}