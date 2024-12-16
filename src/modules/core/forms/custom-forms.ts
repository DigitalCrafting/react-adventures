import {EventEmitter, EventEmitterCallback} from "../events/event-emitter.ts";
import {Subscription} from "rxjs";
import {Schema} from "yup";

interface FormElement<T = never> {
    getIsValid(): boolean
    onValidityChanges(callback: EventEmitterCallback): Subscription

    getValue(): T | T[]
    setValue(value: T | any): void
    onValueChanges(callback: EventEmitterCallback): Subscription
    overrideValue(newValue: any, bubbleEvents: boolean): void
}

abstract class BaseFormElement<T = never> implements FormElement<T> {
    protected isValid;
    protected validatorSchema: Schema;
    protected validityChangesEventEmitter: EventEmitter<boolean>;
    protected valueChangesEventEmitter: EventEmitter<T | any>;

    constructor(validator: Schema) {
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

    onValueChanges(callback: EventEmitterCallback): Subscription {
        return this.valueChangesEventEmitter.subscribe(callback);
    }

    abstract getValue(): T | T[];

    abstract overrideValue(newValue: never, bubbleEvents: boolean): void;

    abstract setValue(value: T | T[]): void;
}

export class FormGroup<T = never> extends BaseFormElement<T>{
    private formConfig: {[key: string]: FormElement<T>}

    constructor(formConfig: { [p: string]: FormElement<T> }, validator: Schema) {
        super(validator);
        this.formConfig = formConfig;
    }

    getValue(): T {
        const valueObject = {} as T;

        if (this.formConfig) {
            for (const key in this.formConfig) {
                const controlValue = this.formConfig[key].getValue()
                // @ts-ignore
                valueObject[key] = controlValue
            }
        }

        return valueObject;
    }

    overrideValue(newValue: any, bubbleEvents: boolean = false): void {
        for (const prop in newValue) {
            if (!Object.prototype.hasOwnProperty.call(this.formConfig, prop)) {
                throw new Error("Value does not match FormGroup configuration")
            }
            this.formConfig[prop].overrideValue(newValue[prop], bubbleEvents);
        }

        if (bubbleEvents) {
            this.valueChangesEventEmitter.emit(newValue)
        }
    }

    setValue(newValue: T): void {
        for (const prop in newValue) {
            if (!Object.prototype.hasOwnProperty.call(this.formConfig, prop)) {
                throw new Error("Value does not match FormGroup configuration")
            }
            this.formConfig[prop].setValue(newValue[prop]);
        }

        this.valueChangesEventEmitter.emit(newValue)
    }
}

export class FormInput<T = never> extends BaseFormElement<T> {
    private value: T;

    constructor(value: T, validator: Schema) {
        super(validator);
        this.value = value
    }

    getValue(): T {
        return this.value;
    }

    overrideValue(newValue: never, bubbleEvents: boolean): void {
        this.value = newValue;
        if (bubbleEvents) {
            this.valueChangesEventEmitter.emit(this.value)
        }
    }

    setValue(value: T): void {
        this.value = value;
        this.valueChangesEventEmitter.emit(this.value)
    }
}

export class FormArray<T = never> extends BaseFormElement<T> {
    private formArray: FormElement[]

    constructor(array: FormElement[], validator: Schema) {
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

    overrideValue(newValue: never[], bubbleEvents: boolean): void {
        if (newValue.length != this.formArray.length) {
            throw new Error("Arrays lengths don't match")
        }

        for (let i = 0; i < newValue.length; i++) {
            this.formArray[i].setValue(newValue[i]);
        }

        if (bubbleEvents) {
            this.valueChangesEventEmitter.emit(newValue);
        }
    }

    setValue(value: T[]): void {
        if (value.length != this.formArray.length) {
            throw new Error("Arrays lengths don't match")
        }

        for (let i = 0; i < value.length; i++) {
            this.formArray[i].setValue(value[i]);
        }

        this.valueChangesEventEmitter.emit(value);
    }
}