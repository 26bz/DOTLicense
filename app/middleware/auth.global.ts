import { unref } from 'vue';

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  if (!unref(loggedIn) && to.path.startsWith('/dashboard')) {
    return navigateTo('/');
  }
});
