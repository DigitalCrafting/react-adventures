import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {reEvaluationEventEmitter, ReEvaluationEventType} from "./re-evaluation-event.ts";



export function ReEvaluationCounter() {
    const [count, setCount] = useState(0)
    const location = useLocation()

    useEffect(() => {
        const sub = reEvaluationEventEmitter.subscribe((event: ReEvaluationEventType) => {
            if (event === 'reset') {
                setCount(0)
            } else {
                setCount(count => count + 1)
            }
        })

        return () => {
            sub.unsubscribe()
        }
    }, []);

    useEffect(() => {
        setCount(0)
    }, [location]);

    return <div className="d-flex flex-row-reverse">
        <span>Components re-evaluated <b>{count}</b></span>
    </div>
}