export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn && to.path.startsWith('/dashboard')) {
    return navigateTo('/login');
  }
});
