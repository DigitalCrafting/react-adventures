import {EventEmitter} from "../../../core/events/event-emitter.ts";

export type ReEvaluationEventType = 'reset' | 'register'

export const reEvaluationEventEmitter: EventEmitter<ReEvaluationEventType> = new EventEmitter<ReEvaluationEventType>()