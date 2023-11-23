import type Navigo from 'navigo'

let rootRouter: Navigo | null = null

export function setRootRouter(router: Navigo) {
  if (rootRouter && router) {
    throw `there is already one router set. Multiple routers per app are not supported yet`;
  }

  rootRouter = router;
}

export function generateRoutePath(path: string, params?: {}): string {
  if (!rootRouter) throw `calling generateRoute() when there is no router instance is not supported`;
  return rootRouter.generate(path, params)
}