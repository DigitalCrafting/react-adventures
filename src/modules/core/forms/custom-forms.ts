import {EventEmitter, EventEmitterCallback} from "../events/event-emitter.ts";
import {Subscription} from "rxjs";
import {ValidationError, ValidatorsComposition} from "../validators/validators.ts";

type EventConfig = {
    emit?: boolean,
    bubbleUp?: boolean
}

export type FormValidationError = ValidationError | null

export interface FormElement {
    getIsValid(): boolean

    getError(): FormValidationError;

    getErrorsTree(): any

    onValidityChanges(callback: EventEmitterCallback): Subscription

    getValue(): any

    setValue(newValue: any, config?: EventConfig): void

    onValueChanges(callback: EventEmitterCallback): Subscription
}

abstract class AbstractFormElement implements FormElement {
    protected _parent: AbstractFormElement | null = null;
    protected _error: FormValidationError;
    protected _isValid: boolean;
    protected _validityChangeEventPending: boolean;
    protected _validator?: ValidatorsComposition;
    protected _validityChangesEventEmitter: EventEmitter<boolean>;
    protected _valueChangesEventEmitter: EventEmitter<any>;

    constructor(validator?: ValidatorsComposition) {
        this._validator = validator
        this._error = null;
        this._isValid = true;
        this._validityChangeEventPending = false;
        this._validityChangesEventEmitter = new EventEmitter();
        this._valueChangesEventEmitter = new EventEmitter();
    }

    getIsValid(): boolean {
        return this._isValid;
    }

    getError(): FormValidationError {
        return this._error;
    }

    getErrorsTree(): any {
        return this._error;
    }

    onValidityChanges(callback: EventEmitterCallback): Subscription {
        return this._validityChangesEventEmitter.subscribe(callback);
    }

    onValueChanges(callback: EventEmitterCallback): Subscription {
        return this._valueChangesEventEmitter.subscribe(callback);
    }

    protected _updateValidityAndEmitEvent(): void {
        this._updateValidity()
        this._emitValidityChanges()
    }

    abstract _updateValidity(): void;

    protected _emitValidityChanges(overridePending: boolean = false) {
        if (this._validityChangeEventPending || overridePending) {
            this._validityChangesEventEmitter.emit(this._isValid)

            if (this._parent) {
                this._parent._emitValidityChanges(true);
            }

            this._validityChangeEventPending = false;
        }
    }

    protected _emitValueChanges(eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }) {
        if (eventConfig.emit) {
            this._valueChangesEventEmitter.emit(this.getValue())
            if (eventConfig.bubbleUp && this._parent) {
                this._parent._emitValueChanges(eventConfig)
            }
        }
    }

    _setParent(parent: AbstractFormElement | null): void {
        this._parent = parent;
    }

    abstract getValue(): any;

    abstract setValue(newValue: any, eventConfig?: EventConfig): void;
}

export class FormGroup extends AbstractFormElement {
    private _formElements: { [key: string]: FormGroup | FormInputControl | FormArray }

    constructor(formElements: {
        [p: string]: FormGroup | FormInputControl | FormArray
    }, validator?: ValidatorsComposition) {
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
        this._updateValidity()
        this._emitValueChanges(eventConfig)
        this._emitValidityChanges()
    }

    getElement(key: string): FormGroup | FormInputControl | FormArray {
        return this._formElements[key]
    }

    /**
     * Returns nested child component using path.
     *
     * Path parts should be separated using coma,
     * if path goes through FormArray, use index to get concrete element.
     * */
    getElementFromPath(path: string): FormGroup | FormInputControl | FormArray {
        const pathParts = path.split('.')

        if (pathParts.length === 1) {
            return this._formElements[pathParts[0]]
        }

        if (pathParts.length > 1) {
            let element: FormGroup | FormInputControl | FormArray | undefined = undefined;
            for (let i = 0; i< pathParts.length; i++) {
                const pathPart = pathParts[i];

                // @ts-ignore
                if (!element) {
                    element = this._formElements[pathPart]
                } else{
                    if (element instanceof FormGroup) {
                        element = element.getElement(pathPart)
                    } else if (element instanceof FormArray) {
                        element = element.getElement(+pathPart)
                    } else {
                        /* We should only get FormInputControl as the last element */
                        throw new Error(`Path ${path} does not match actual form structure`)
                    }
                }
            }

            return element as FormGroup | FormInputControl | FormArray
        }

        throw new Error(`Element on path ${path} does not exist.`)
    }

    getErrorsTree(): Record<string, any> {
        const errorTree: Record<string, any> = {}

        this._forEachChild((control, key) => {
            errorTree[key] = control.getErrorsTree()
        })

        return errorTree
    }

    _updateValidity(): void {
        let newValid = true;
        if (this._validator) {
            const newError = this._validator.validate(this.getValue())
            if (newError !== this._error) {
                this._error = newError;
                newValid = newError === null;
            }
        }

        let childrenValid = true
        this._forEachChild((control) => {
            childrenValid = childrenValid && control.getIsValid()
        })

        if (this._isValid !== (childrenValid && newValid)) {
            this._isValid = childrenValid && newValid;
            this._validityChangeEventPending = true;
        }

        if (this._parent && this._validityChangeEventPending) {
            this._parent._updateValidity();
        }
    }

    // Internal
    private _forEachChild(cb: (v: any, k: string) => void): void {
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

export class FormInputControl extends AbstractFormElement {
    private _value: any | null;

    constructor(value: any | null = null, validator?: ValidatorsComposition) {
        super(validator);
        this._value = value
        this._updateValidity()
    }

    getValue(): any | null {
        return this._value;
    }

    setValue(newValue: any, eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }): void {
        this._value = newValue;
        this._emitValueChanges(eventConfig)
        this._updateValidityAndEmitEvent()
    }

    _updateValidity(): void {
        let newValid = true;
        if (this._validator) {
            const newError = this._validator.validate(this._value)
            if (this._error !== newError) {
                this._error = newError;
                newValid = newError === null;
            }
        }

        if (this._isValid !== newValid) {
            this._isValid = newValid;
            this._validityChangeEventPending = true;
        }

        if (this._parent && this._validityChangeEventPending) {
            this._parent._updateValidity();
        }
    }
}

export class FormArray extends AbstractFormElement {
    private _formArray: (FormGroup | FormInputControl | FormArray)[]

    constructor(array: (FormGroup | FormInputControl | FormArray)[], validator?: ValidatorsComposition) {
        super(validator);
        this._formArray = array || [];
        this._setUpElements();
        this._updateValidity();
    }

    getValue(): any[] {
        const valueArray = [] as any[]

        for (const el of this._formArray) {
            valueArray.push(el.getValue())
        }

        return valueArray;
    }

    setValue(newValue: any[], eventConfig: EventConfig = {
        emit: true,
        bubbleUp: true
    }): void {
        if (newValue.length != this._formArray.length) {
            throw new Error("Arrays lengths don't match")
        }

        for (let i = 0; i < newValue.length; i++) {
            // We don't want to 'bubbleUp' the event, since this control we emit change after the loop
            this._formArray[i].setValue(newValue[i], {emit: eventConfig.emit, bubbleUp: false});
        }

        this._emitValueChanges(eventConfig)
    }

    getElement<T = FormGroup | FormInputControl | FormArray>(index: number): T {
        return this._formArray[index] as T
    }

    removeElement(index: number) {
        if (index < 0 || index >= this._formArray.length) {
            console.log(`Index out of bounds: ${index}`)
            return
        }

        if (this._formArray[index]) {
            this._formArray[index]._setParent(null)
            this._formArray.splice(index, 1)
            this._updateValidityAndEmitEvent()
            this._emitValueChanges()
        }
    }

    pushElement(element: (FormGroup | FormInputControl | FormArray)) {
        this._formArray.push(element);
        element._setParent(this);
        this._updateValidityAndEmitEvent()
        this._emitValueChanges();
    }

    get length(): number {
        return this._formArray.length
    }

    getIsValid(): boolean {
        return this._isValid;
    }

    getErrorsTree(): any[] {
        return this._formArray.map(control => {
            return control.getErrorsTree();
        })
    }

    _updateValidity(): void {
        let newValid = true;

        if (this._validator) {
            const newError = this._validator.validate(this.getValue())
            if (newError !== this._error) {
                this._error = newError;
                newValid = newError === null;
            }
        }

        let childrenValid = true
        this._forEachChild((control) => {
            childrenValid = childrenValid && control.getIsValid()
        })

        if (this._isValid !== (childrenValid && newValid)) {
            this._isValid = childrenValid && newValid;
            this._validityChangeEventPending = true;
        }

        if (this._parent && this._validityChangeEventPending) {
            this._parent._updateValidity();
        }
    }

    private _forEachChild(cb: (control: (FormGroup | FormInputControl | FormArray), index: number) => void): void {
        this._formArray.forEach((control, index) => {
            cb(control, index);
        });
    }

    private _setUpElements() {
        this._forEachChild((control) => {
            control._setParent(this);
        })
    }
}