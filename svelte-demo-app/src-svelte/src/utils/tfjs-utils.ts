// @ts-ignore
let servicesUrl = process.env.TF_SERVICE_ENDPOINT;

console.log(process.env)
export let remoteSession: $tf.remote.TribefireRemoteSession;
export let persistenceSession: $tf.session.PersistenceGmSession;

export async function tfAuthenticate(username, password) {
  const config = $T.tribefire.js.model.config.RemoteSessionConfig.create();
  config.credentials = $tf.credentials.userPassword(username, password);
  config.servicesUrl = servicesUrl as string;

  return $tf.remote.sessionFactory.open(config).then((session: $tf.remote.TribefireRemoteSession) => {
    remoteSession = session;
    return remoteSession;
  });
}

export function authenticateViaSessionId(sessionId: string) {
  var config = $T.tribefire.js.model.config.RemoteSessionConfig.create();
  config.credentials = $tf.credentials.sessionId(sessionId);

  config.servicesUrl = servicesUrl as string;
  return $tf.remote.sessionFactory
    .open(config)
    .then((session) => {
      remoteSession = session;
      return remoteSession;
    })
}

export async function getSession(session: $tf.remote.TribefireRemoteSession, accessId: string): Promise<$tf.session.PersistenceGmSession> {
  return session ? session.openPersistenceSession(accessId) : null;
}

export async function getCurrentUser(session: $tf.remote.TribefireRemoteSession) {
  const currentUser = session.getUserSession().user;
  const contentSession = await getSession(session, 'auth')
  currentUser['sessionRoles'] = contentSession.getSessionAuthorization().getUserRoles().toArray()
  currentUser['pictureUrl'] = `${process.env.TF_SERVICE_ENDPOINT}/user-image?name=${currentUser['name']}&sessionId=${session.getUserSession().sessionId}`
  return currentUser;
}

export async function logOut(session: $tf.remote.TribefireRemoteSession, persistenceSession: $tf.session.PersistenceGmSession) {
  const r = $T.com.braintribe.model.securityservice.Logout.create();
  r.sessionId = session.getUserSession().sessionId;
  persistenceSession.evaluate(r).then(b => {
    if (b) {
      localStorage.removeItem('tfSessionId')
      localStorage.removeItem('currentUser')
    }
  });
}

export function convertJsDate(jsDate: Date): any {
  return $tf.time.fromJsDate(jsDate);
}

export function isDateBetweenDates(
  date: any,
  startDate: any,
  endDate: any
): boolean {
  return startDate.before(date) && date.before(endDate);
}

export function getDayFromDate(date: any): number {
  return date.getDate();
}

export function getEnumTypeConstants(enumTypeSignature: string): string[] {
  const res: any = [];
  const enumInstance = $tf.getTypeReflection().getEnumTypeBySignature(enumTypeSignature);
  enumInstance.getEnumValues().forEach((v) => {
    res.push(v);
  });
  console.log(res)
  return res;
}

export function getEnumAsArray(enumConstant: $tf.reflection.EnumType): string[] {
  const res: any = [];
  const enumInstance = $tf.getTypeReflection().getEnumTypeOf(enumConstant);
  enumInstance.getEnumValues().forEach((v: any) => {
    res.push(v);
  });

  return res;
}

export function getTypeOf(entity: $tf.reflection.GenericModelType): string {
  // return entity.getTypeSignature()
  return $tf.getTypeReflection().getTypeOf(entity).getTypeSignature()
}

export function createEnumInstance(
  enumTypeSignature: string,
  enumConstant: string
) {
  const enumType = $tf.getTypeReflection().getEnumTypeBySignature(enumTypeSignature);
  const enumInstance = enumType.getEnumValue(enumConstant);
  return enumInstance;
}

export async function query(session: $tf.session.PersistenceGmSession, query: string): Promise<any> {
  const q = $tf.query.parse(query);
  return session.query().select(q)
}

export async function queryAll(session: $tf.session.PersistenceGmSession, query: string): Promise<any> {
  // const q = $tf.query.parse(query);
  // q.traversingCriterion = $tf.tc.create().negation().joker().done(); //TC for getting all info
  // return session.query().select(q)
  return queryTC(session, query, $tf.tc.create().negation().joker().done())
}

export async function queryTC(session: $tf.session.PersistenceGmSession, query: string, tc: $T.com.braintribe.model.query.Query.traversingCriterion): Promise<any> {
  const q = $tf.query.parse(query);
  q.traversingCriterion = tc;
  return session.query().select(q)
}

export async function executeServiceRequest(
  session: $tf.session.PersistenceGmSession,
  domainId: string,
  serviceRequestEntityType: string,
  params?: Map<string, any>
): Promise<any> {
  const request = $tf.getTypeReflection().getTypeBySignature(serviceRequestEntityType).create(); //$T.get(serviceRequestEntityType).create()
  request.domainId = domainId
  if (params) {
    const iterator: Iterator<[string, any]> = params.entries()

    let param = iterator.next()
    while (!param.done) {
      request[param.value[0]] = param.value[1]
      param = iterator.next()
    }
  }
  return session.evaluate(request)
}

export function getLocale(value: any, lang: string): string {
  // if (typeof value === 'string' && !value) return value;
  return lang
    ? value?.value(lang)
    : value
      ? $tf.i18n.getDefaultLocale(value)
      : null;
}

export async function setLocale(ls: any, value: string, lang: string, session: $tf.session.PersistenceGmSession) {
  // if (!ls) ls = $tf.i18n.createLocalizedString(value);
  if (!value) return null
  if (!ls) ls = session.create($T.com.braintribe.model.generic.i18n.LocalizedString)
  if (lang === 'en') ls.put('default', value);
  ls.put(lang, value);
  return ls;
}

export function lazyLoad(entity: $T.com.braintribe.model.meta.GmEntityType, propertyName: string) {
  return lazyLoadTC(entity, propertyName, $tf.tc.create().negation().joker().done())
}

export async function lazyLoadTC(entity: $T.com.braintribe.model.meta.GmEntityType, propertyName: string, tc: $T.com.braintribe.model.query.Query.traversingCriterion) {
  const property = entity.Type().findProperty(propertyName);
  if (property && property.isAbsent(entity)) {
    const q = $tf.query.parse("property " + propertyName + " of reference(" + entity.Type().getTypeSignature() + ", '" + entity.id + "')");
    q.traversingCriterion = tc
    const res = await (entity.Session() as $tf.session.PersistenceGmSession).query().property(q)
    // if (res) entity[propertyName] = res.value()
    return res.value()
  } else {
    return property ? entity[propertyName] : null
  }

}
