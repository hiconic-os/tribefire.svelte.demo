// Generic types

// TODO: redefine Id type to read it's real time from $T namespace
export type Id = string; // typeof $T.com.braintribe.model.generic.GenericEntity.id;
export type GenericEntity = $T.com.braintribe.model.generic.GenericEntity;
export type Collection<E> = $tf.Collection<E>
export interface HasId {
  id: Id;
}
