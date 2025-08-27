import { defineAbility } from 'nuxt-authorization/utils';

export const viewDashboard = defineAbility((user) => !!user);
