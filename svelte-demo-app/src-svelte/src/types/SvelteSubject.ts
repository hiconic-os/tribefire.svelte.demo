import { BehaviorSubject, Operator, Subscription } from "rxjs";

interface SvelteSubjectParams<T> {
  onNext?: (value: T) => any;
}

export class SvelteSubject<T> extends BehaviorSubject<T> {
  private onNext?: (value: T) => any;

  constructor(value: T, params: SvelteSubjectParams<T> = {}) {
    super(value);
    this.onNext = params.onNext;
    this.set = this.next;
  }

  next(value: T) {
    super.next(value)
    if (this.onNext) {
      this.onNext(value);
    }
  }

  update(updater: (currentValue: T) => T) {
    super.next(updater(this.value));
  }

  set(value: T) { }

  // <R>(operator: Operator<T, R>) => Observable<R>
  lift<R>(operator: Operator<T, R>) {
    const result = new SvelteSubject<T>(this.value);
    result.operator = operator as any;
    result.source = this as any;
    return result as any;
  }
}

interface SvelteStartStopSubjectParams<T> extends SvelteSubjectParams<T> {
  onStart?: () => any;
  onStop?: () => any;
}

export class SvelteStartStopSubject<T> extends SvelteSubject<T> {
  private subscriptionCounter = 0;
  protected onStart?: () => any;
  protected onStop?: () => any;

  constructor(value: T, params: SvelteStartStopSubjectParams<T> = {}) {
    super(value, params);
    this.onStart = params.onStart;
    this.onStop = params.onStop;
  }

  private onUnsubscribe() {
    this.subscriptionCounter--;

    if (this.subscriptionCounter === 0 && this.onStop) this.onStop();
  }

  subscribe(...args: any): Subscription {
    if (this.subscriptionCounter === 0 && this.onStart) this.onStart();

    this.subscriptionCounter++;

    const subscription = super.subscribe(...args);
    subscription.add(() => this.onUnsubscribe());
    return subscription;
  }
}