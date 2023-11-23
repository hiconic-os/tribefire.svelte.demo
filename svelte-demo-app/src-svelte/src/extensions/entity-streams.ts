import { Observable } from 'rxjs';
import { SvelteStartStopSubject } from '../types/SvelteSubject';
import { GenericEntity } from '../types/Base';

let warnedAboutEntityAsObservablePerformance = false;

export const entityAsObservable =
  function
    <T extends GenericEntity>
    (
      entity: T | null
    )
    : Observable<T> | null {

    if (!warnedAboutEntityAsObservablePerformance) {
      warnedAboutEntityAsObservablePerformance = true;
      console.warn(`Subscribing to an entity will rerender all components on any entity's property change.\nFor better performance use propertyAsWritableStream(entity, propertyName) or propertyAsReadableStream(entity, propertyName)`);
    }

    if (!entity) return null

    if ((entity as any)._selfObservable) return (entity as any)._selfObservable;

    let listener;
    let subject;

    subject = new SvelteStartStopSubject(entity, {
      onStart: () => {
        // listener = new $tf.manipulation.ManipulationListener();
        // listener.noticeManipulation = () => {
        //   subject.next(entity);
        // };
        // entity.Session().listeners().entity(entity).add(listener);

        entity.Session().listeners().entity(entity).add((m: any) => {
          console.log({ m })
          subject.next(entity);
        });
      },
      onStop: () => {
        entity.Session().listeners().entity(entity).remove(listener);
      },
      // onNext: nextValue => {
      //   entity[propertyName] = nextValue;
      // }
    });

    (entity as any)._selfObservable = subject.asObservable();

    return subject.asObservable();
  };

export const set =
  function
    <T extends GenericEntity>
    (
      entity: T | null,
      nextValue
    )
    : void {

    // NOOP
  };

export const propertyAsWritableStream =
  function
    <
      T extends GenericEntity,
      Key extends keyof T
    >
    (
      entity: T | null,
      propertyName: Key
    )
    : SvelteStartStopSubject<T[Key]> | null {

    if (!entity) return null

    if (!(entity as any)._propertyNameToSubjectMap) {
      (entity as any)._propertyNameToSubjectMap = new Map();
    }

    const propertyNameToSubjectMap = (entity as any)._propertyNameToSubjectMap;

    if (propertyNameToSubjectMap.has(propertyName)) return propertyNameToSubjectMap.get(propertyName);

    let listener;
    let subject;
    let ignoreNextStreamEmit = false
    let ignoreNextListener = false

    // console.log(`CREATE propertyAsWritableStream: "${propertyName}"`)

    subject = new SvelteStartStopSubject(entity[propertyName], {
      onStart: () => {
        entity.Session().listeners().entityProperty(entity, propertyName).add(manipulation => {
          if (ignoreNextListener) {
            ignoreNextListener = false;
            return;
          }

          ignoreNextStreamEmit = true
          subject.next(entity[propertyName]);
        });
      },
      onStop: () => {
        entity.Session().listeners().entityProperty(entity, propertyName).remove(listener);
      },
      onNext: nextValue => {
        if (ignoreNextStreamEmit) {
          ignoreNextStreamEmit = false;
          return;
        }

        if (entity[propertyName] !== nextValue) {
          ignoreNextListener = true;
          entity[propertyName] = nextValue;
        }
      }
    });

    propertyNameToSubjectMap.set(propertyName, subject);

    return subject;
  };

export const propertyAsReadableStream =
  function
    <
      T extends GenericEntity,
      Key extends keyof T
    >
    (
      entity: T | null,
      propertyName: Key
    )
    : Observable<T[Key]> | null {

    if (entity) {
      return (propertyAsWritableStream(entity, propertyName) as SvelteStartStopSubject<T[Key]>).asObservable();
    }
    return null
  };
