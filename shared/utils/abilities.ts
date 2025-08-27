import { defineAbility, allow, deny } from 'nuxt-authorization/utils';

export const viewDashboard = defineAbility((user) => !!user);

export const viewLicense = defineAbility((user, license) => {
  if (user.id === license.userId) {
    return allow();
  }
  return deny();
});
