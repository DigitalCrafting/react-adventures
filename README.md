# react-adventures

In this project I want to explore different ways of handling forms in React:
- Zod - using `Zod` and `useForm`,
- Formik - using `Formik`,
- Custom - I will try to implement custom form solution. 

### Custom solution

Triggering whole component tree re-evaluation, when only single nested input changes is a deal breaker. This should never happen, and, unfortunately, that's how `Formik` works. 

Goal is to have something similar to Angular's `FormGroup, FormControl and FormArray` and to never trigger Reacts re-evaluation of the whole components tree - only the inputs and when user wants it.
Probably on subscription to change event.