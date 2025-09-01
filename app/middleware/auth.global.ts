import { unref } from 'vue'

export default defineNuxtRouteMiddleware(async to => {
  const { loggedIn, fetch } = useUserSession()

  await fetch()

  if (to.meta.auth && !unref(loggedIn)) {
    return navigateTo('/')
  }
})
