import {Subject, Subscription} from "rxjs";

export type EventEmitterCallback = (value: never) => void

export class EventEmitter<T> {
    private subject: Subject<T>;

    constructor() {
        this.subject = new Subject()
    }

    subscribe(callback: EventEmitterCallback): Subscription {
        return this.subject.subscribe(value => callback(value as never));
    }

    emit(value: T): void {
        this.subject.next(value)
    }
}