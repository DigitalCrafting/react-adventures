import {EventEmitter, EventEmitterCallback} from "../events/event-emitter.ts";
import {Subscription} from "rxjs";
import {Schema} from "yup";

type EventConfig = {
    emit: boolean,
    bubbleUp: boolean
}

interface FormElement<T = never> {
    getIsValid(): boolean
    onValidityChanges(callback: EventEmitterCallback): Subscription
    emitValidityChanges(eventConfig?: EventConfig): void

    getValue(): T | T[]
    setValue(newValue: T | any, config?: EventConfig): void
    onValueChanges(callback: EventEmitterCallback): Subscription
    emitValueChanges(eventConfig?: EventConfig): void
}

abstract class BaseFormElement<T = never> implements FormElement<T> {
    protected parent: BaseFormElement | null = null;
    protected isValid;
    protected validatorSchema?: Schema;
    protected validityChangesEventEmitter: EventEmitter<boolean>;
    protected valueChangesEventEmitter: EventEmitter<T | any>;

    constructor(validator?: Schema) {
        this.validatorSchema = validator
        this.isValid = true;
        this.validityChangesEventEmitter = new EventEmitter();
        this.valueChangesEventEmitter = new EventEmitter();
    }


    getIsValid(): boolean {
        return this.isValid;
    }

    onValidityChanges(callback: EventEmitterCallback): Subscription {
        return this.validityChangesEventEmitter.subscribe(callback);
    }

    emitValidityChanges(eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }) {
        if (eventConfig.emit) {
            this.validityChangesEventEmitter.emit(this.getIsValid())
            if (eventConfig.bubbleUp && this.parent) {
                this.parent.emitValidityChanges(eventConfig)
            }
        }
    }

    onValueChanges(callback: EventEmitterCallback): Subscription {
        return this.valueChangesEventEmitter.subscribe(callback);
    }

    emitValueChanges(eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }) {
        if (eventConfig.emit) {
            this.valueChangesEventEmitter.emit(this.getValue())
            if (eventConfig.bubbleUp && this.parent) {
                this.parent.emitValueChanges(eventConfig)
            }
        }
    }

    setParent(parent: BaseFormElement): void {
        this.parent = parent;
    }

    abstract getValue(): T | T[];

    abstract setValue(newValue: T | T[], eventConfig?: EventConfig): void;
}

export class FormGroup<T = never> extends BaseFormElement<T>{
    private _formElements: {[key: string]: FormElement<T>}

    constructor(formElements: { [p: string]: FormElement<T> }, validator?: Schema) {
        super(validator);
        this._formElements = formElements;
        this._setUpElements();
    }

    getValue(): T {
        const valueObject = {} as T;

        this._forEachChild((control, key) => {
            const controlValue = control.getValue()
            // @ts-ignore
            valueObject[key] = controlValue

        })

        return valueObject;
    }

    setValue(newValue: T, eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }): void {
        for (const prop in newValue) {
            if (!Object.prototype.hasOwnProperty.call(this._formElements, prop)) {
                throw new Error("Value does not match FormGroup configuration")
            }
            this._formElements[prop].setValue(newValue[prop], {emit: true, bubbleUp: false});
        }

        this.emitValueChanges(eventConfig)
    }

    // Internal
    _forEachChild(cb: (v: any, k: any) => void): void {
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

    _setUpElements() {
        this._forEachChild((control) => {
            control.setParent(this)
        })
    }
}

export class FormInput<T = never> extends BaseFormElement<T> {
    private value: T;

    constructor(value: T, validator?: Schema) {
        super(validator);
        this.value = value
    }

    getValue(): T {
        return this.value;
    }

    setValue(newValue: T, eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }): void {
        this.value = newValue;
        this.emitValueChanges(eventConfig)
    }
}

export class FormArray<T = never> extends BaseFormElement<T> {
    private formArray: FormElement[]

    constructor(array: FormElement[], validator?: Schema) {
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

        this.emitValueChanges(eventConfig)
    }
}