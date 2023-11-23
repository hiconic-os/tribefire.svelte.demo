const Routes = {
  Home: '/',
  Login: '/login',
  Profile: '/profile',
}

const RouteGroupSets = []

export const RouteGroups = new Map<string, Set<string>>()

RouteGroupSets.forEach(routeSet => {
  routeSet.forEach(route => {
    RouteGroups.set(route, routeSet)
  })
})

export const MainMenuRoutes = new Set([
  Routes.Home,
])

export const MainLangMenuRoutes = new Set(MainMenuRoutes)

export default Routes
