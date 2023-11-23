import Routes from './utils/routes'
import { RouteMap, RouteGuard, RouterContext, Redirect } from './components/router'
import LoginRoute from './components/routes/login/LoginRoute.svelte'
import ProfileRoute from './components/routes/profile/ProfileRoute.svelte'


interface MainRouterContext extends RouterContext {
  isAuthenticatingViaSessionId: any
  isSignedIn: any
}

const privateRouteGuard: RouteGuard<MainRouterContext> = ({ isSignedIn }) => {
  return !isSignedIn
}

const loginRouteGuard: RouteGuard<MainRouterContext> = ({ isSignedIn }) => {
  return isSignedIn
}

// on App start we will read sessionId from localStorage and try to auth using it
// do not render any component while isAuthenticatingViaSessionId === true
export const routerGuard: RouteGuard<MainRouterContext> = ({ isAuthenticatingViaSessionId }) => {
  return isAuthenticatingViaSessionId as boolean
}

export const routes: RouteMap<MainRouterContext> = {
  // private routes
  [Routes.Profile]: {
    component: ProfileRoute,
    guard: privateRouteGuard,
    whenLocked: LoginRoute,
  },


  // public routes
  [Routes.Login]: {
    component: LoginRoute,
    guard: loginRouteGuard,
    whenLocked: Redirect(Routes.Profile),
  },
  // home must be last because all other paths include homePath
  [Routes.Home]: { component: Redirect(Routes.Profile) },
}