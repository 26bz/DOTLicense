import { unref } from 'vue'

export default defineNuxtRouteMiddleware(async to => {
  const { loggedIn, fetch } = useUserSession()

  await fetch()

  if (!unref(loggedIn) && to.path.startsWith('/dashboard')) {
    return navigateTo('/')
  }
})
