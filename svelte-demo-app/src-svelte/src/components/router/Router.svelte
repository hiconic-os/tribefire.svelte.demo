<script type="ts">
  import { onDestroy, SvelteComponent } from 'svelte'
  import { SvelteComponentDev } from 'svelte/internal'
  import Navigo from 'navigo'

  import { deepCompare, isNil } from '../../utils/helpers/lodashy'
  import {
    currentRoutePathSubject as pathStore,
    currentRouteParamsSubject as routeParamsStore,
  } from './router-store'
  import { setRootRouter } from './navigation'
  import { RedirectClass } from './redirect'
  import type { Route, RouteGuard, RouteMap, RouterContext } from './types'
  import { commit } from '../../utils/data-utils'

  export let routes: RouteMap<RouterContext> | null = null
  export let routerContext: {} | null = null
  export let guard: RouteGuard<RouterContext> | null = null
  export let componentWhenLocked: SvelteComponent | SvelteComponentDev | RedirectClass | null = null
  export let notFoundComponent: SvelteComponent | SvelteComponentDev | RedirectClass | null = null

  let activeRoute: Route<RouterContext> | null = null
  let activeRouteGuard: RouteGuard<RouterContext> | null = null
  let activeRouteComponent: SvelteComponent | SvelteComponentDev | RedirectClass | null = null
  let navigationParams: {} | null = null
  let isRouterLocked: boolean = false
  let isActiveRouteLocked: boolean = false

  let componentToRender: SvelteComponent | SvelteComponentDev | RedirectClass | null = null

  $: {
    if (guard && routerContext) {
      const nextIsRouterLocked = Boolean(guard(routerContext))
      if (isRouterLocked !== nextIsRouterLocked) {
        isRouterLocked = nextIsRouterLocked
      }
    } else {
      isRouterLocked = false
    }
  }

  $: if (activeRouteGuard !== (activeRoute?.guard ?? null)) {
    activeRouteGuard = activeRoute?.guard ?? null
  }

  $: {
    if (activeRouteGuard && routerContext) {
      const nextIsActiveRouteLocked = Boolean(activeRouteGuard(routerContext))
      if (isActiveRouteLocked !== nextIsActiveRouteLocked) {
        isActiveRouteLocked = nextIsActiveRouteLocked
      }
    } else {
      isActiveRouteLocked = false
    }
  }

  onDestroy(() => {
    setRootRouter(null)
  })

  function handleRouteChange(path: string, route: Route<RouterContext>, params: {} | null) {
    if (pathStore.value !== path) {
      console.log('%c next path: ', 'color: lime', path)
      pathStore.next(path)
      commit()
    }

    if (activeRoute !== route) {
      activeRoute = route
    }

    if (
      activeRouteComponent !== route.component &&
      !(isNil(activeRouteComponent) && isNil(route.component))
    ) {
      activeRouteComponent = route.component ?? null
    }

    if (!deepCompare(routeParamsStore.value, route.componentParams, true)) {
      routeParamsStore.next(route.componentParams ?? null)
    }

    if (!deepCompare(navigationParams, params, true)) {
      navigationParams = params ?? null
    }
  }

  const routeHandlers = (path: string, route: Route<RouterContext>) => ({
    after: function (params) {
      handleRouteChange(path, route, params)
    },
  })

  let navigoRouter: Navigo | null = null

  $: {
    activeRoute = null
    activeRouteComponent = null
    navigationParams = null

    if (navigoRouter) {
      setRootRouter(null)
      navigoRouter.destroy()
    }

    if (routes) {
      navigoRouter = new Navigo(null, true)
      setRootRouter(navigoRouter)

      Object.entries(routes).forEach(([path, route]) => {
        const registerPath = path === '/' ? '' : path
        console.log(`%cregistering route`, 'color: yellow', path)

        navigoRouter.on(
          registerPath,
          {
            as: path,
            uses: function () {},
          },
          routeHandlers(path, route),
        )
      })

      navigoRouter.notFound(() => {
        if (!notFoundComponent) {
          console.error(
            'notFound route reached. notFoundComponent is not specified in the Router component',
          )
        }
        activeRouteComponent = notFoundComponent ?? null
        if (routeParamsStore.value !== null) routeParamsStore.next(null)
        navigationParams = null
      })

      navigoRouter.resolve()
    }
  }

  // recalc all params when navigationParams or routeParams change
  $: params = navigationParams
    ? $routeParamsStore
      ? { ...navigationParams, ...$routeParamsStore }
      : navigationParams
    : $routeParamsStore ?? null

  $: {
    const nextComponentToRender = isRouterLocked
      ? componentWhenLocked ?? null
      : isActiveRouteLocked
      ? activeRoute?.whenLocked ?? null
      : activeRoute?.component ?? null
    if (componentToRender !== nextComponentToRender) {
      componentToRender = nextComponentToRender
    }
  }

  $: if (componentToRender instanceof RedirectClass) {
    ;(componentToRender as RedirectClass).execute()
    componentToRender = null
  }

  $: renderingParams = isRouterLocked || isActiveRouteLocked ? null : params
  $: console.log('%crenderingParams', 'color: cyan', renderingParams)
</script>

<!-- if !routerContext component has not finished initializing yet-->
{#if routerContext && componentToRender}
  <svelte:component this={componentToRender} {...renderingParams} />
{/if}
