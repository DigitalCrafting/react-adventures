/* --------------- */
/* Validator types */
/* --------------- */
export type ValidationError = string | null

export type ValidatorFunc = (value: any, message?: string) => ValidationError

export interface ValidatorsComposition<T = any> {
    validate(value: T): ValidationError;
}

enum BuiltInValidators {
    REQUIRED = 'REQUIRED',
    MIN_LENGTH = 'MIN_LENGTH',
    MAX_LENGTH = 'MAX_LENGTH',
    MIN_VALUE = 'MIN_VALUE',
    MAX_VALUE = 'MAX_VALUE'
}

export const DEFAULT_VALIDATION_ERRORS: Record<BuiltInValidators, string> = {
    REQUIRED: 'Field is required',
    MIN_LENGTH: "Field's value is too short",
    MAX_LENGTH: "Field's value is too long",
    MIN_VALUE: "Field's value is too small",
    MAX_VALUE: "Field's value is too big",
}

/* --------------------- */
/* Validator definitions */
/* --------------------- */
const requiredValidator = (value: any, message = DEFAULT_VALIDATION_ERRORS.REQUIRED): ValidationError => {
    return !value ? message : null;
}

const minLengthValidator = (value: any, minLength: number, message = DEFAULT_VALIDATION_ERRORS.MIN_LENGTH): ValidationError => {
    if (!value) {
        /* For this validator, if it does not exist, it's valid */
        return null
    }

    if (typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'length')) {
            return value.length < minLength ? message : null
        } else {
            return null;
        }
    } else {
        return String(value).length < minLength ? message : null;
    }
}

const maxLengthValidator = (value: any, maxLength: number, message = DEFAULT_VALIDATION_ERRORS.MAX_LENGTH): ValidationError => {
    if (!value) {
        /* For this validator, if it does not exist, it's valid */
        return null
    }

    if (typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'length')) {
            return value.length > maxLength ? message : null
        } else {
            return null;
        }
    } else {
        return String(value).length > maxLength ? message : null;
    }
}

const minValueValidator = (value: number, min: number, message = DEFAULT_VALIDATION_ERRORS.MIN_VALUE): ValidationError => {
    if (!value) {
        return null
    }

    if (isNaN(value)) {
        throw new TypeError(`minValueValidator: Expected number, got: ${typeof value}`)
    }

    return value < min ? message : null
}

const maxValueValidator = (value: number, max: number, message = DEFAULT_VALIDATION_ERRORS.MAX_VALUE): ValidationError => {
    if (!value) {
        return null
    }

    if (isNaN(value)) {
        throw new TypeError(`maxValueValidator: Expected number, got: ${typeof value}`)
    }

    return value > max ? message : null
}

/* ----------------------------- */
/* Validators 'namespace' export */
/* ----------------------------- */
export class Validators {
    static required(message?: string): ValidatorFunc {
        return (value) => requiredValidator(value, message);
    }

    static minLength(minLength: number, message?: string): ValidatorFunc {
        return (value) => minLengthValidator(value, minLength, message);
    }

    static maxLength(maxLength: number, message?: string): ValidatorFunc {
        return (value) => maxLengthValidator(value, maxLength, message);
    }

    static min(min: number, message?: string): ValidatorFunc {
        return (value) => minValueValidator(value, min, message);
    }

    static max(max: number, message?: string): ValidatorFunc {
        return (value) => maxValueValidator(value, max, message);
    }
}

/* -------------------------- */
/* Validators builder classes */
/* -------------------------- */
abstract class BaseValidatorComposition<T = any> implements ValidatorsComposition<T> {
    protected _validators: ValidatorFunc[]

    constructor() {
        this._validators = [];
    }

    public validator(custom: ValidatorFunc) {
        this._validators.push(custom);
        return this;
    }

    public validate(value: T): ValidationError {
        for (const validator of this._validators) {
            const validationError = validator(value)
            if (validationError) {
                return validationError;
            }
        }

        return null;
    }
}


class StringValidator extends BaseValidatorComposition<string> {
    public required(message?: string) {
        this._validators.push(Validators.required(message))
        return this
    }

    public minLength(minLength: number, message?: string) {
        this._validators.push(Validators.minLength(minLength, message));
        return this
    }

    public maxLength(maxLength: number, message?: string) {
        this._validators.push(Validators.maxLength(maxLength, message));
        return this
    }
}

class NumbersValidator extends BaseValidatorComposition<number> {
    public required(message?: string) {
        this._validators.push(Validators.required(message))
        return this
    }

    public min(min: number, message?: string) {
        this._validators.push(Validators.min(min, message));
        return this
    }

    public max(max: number, message?: string) {
        this._validators.push(Validators.max(max, message));
        return this
    }
}

class ArraysValidator extends BaseValidatorComposition<any[]> {
    public required(message?: string) {
        this._validators.push(Validators.required(message))
        return this
    }

    public minLength(minLength: number, message?: string) {
        this._validators.push(Validators.minLength(minLength, message));
        return this
    }

    public maxLength(maxLength: number, message?: string) {
        this._validators.push(Validators.maxLength(maxLength, message));
        return this
    }
}

class TypelessValidator extends BaseValidatorComposition {
    constructor(validators: ValidatorFunc[]) {
        super();
        this._validators = validators
    }
}

/* -------------------------------------- */
/* Validators builders 'namespace' export */
/* -------------------------------------- */
export class ValidatorComposers {
    static string(): StringValidator {
        return new StringValidator()
    }

    static number(): NumbersValidator {
        return new NumbersValidator()
    }

    static array(): ArraysValidator {
        return new ArraysValidator()
    }

    static compose(...validators: ValidatorFunc[]): TypelessValidator {
        return new TypelessValidator(validators)
    }
}