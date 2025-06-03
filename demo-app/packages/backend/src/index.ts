/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes
backend.add(import('@backstage/plugin-kubernetes-backend'));

import { createBackendModule } from '@backstage/backend-plugin-api';
import { githubAuthenticator } from '@backstage/plugin-auth-backend-module-github-provider';
import { microsoftAuthenticator } from '@backstage/plugin-auth-backend-module-microsoft-provider';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';

import { stringifyEntityRef } from '@backstage/catalog-model';

const customAuth = createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'custom-auth-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        // GitHub provider
        providers.registerProvider({
          providerId: 'github',
          factory: createOAuthProviderFactory({
            authenticator: githubAuthenticator,
            async signInResolver(info, ctx) {
              const userId = info.result.fullProfile.username || 'unknown-user';
              console.warn(`No email found for user, using username: ${userId}`);

              console.log(info);

              if (!userId) {
                throw new Error('User profile contained no valid email or username');
              }

              const userEntity = stringifyEntityRef({
                kind: 'User',
                name: userId,
                namespace: 'default',
              });

              return ctx.issueToken({
                claims: {
                  sub: userEntity,
                  ent: [userEntity]
                },
              });
            },
          }),
        });

        // Microsoft provider
        providers.registerProvider({
          providerId: 'microsoft',
          factory: createOAuthProviderFactory({
            authenticator: microsoftAuthenticator,
            async signInResolver(info, ctx) {
              console.log('Microsoft auth info:', JSON.stringify(info, null, 2));
              
              // Extract user information from Microsoft profile
              const email = info.profile.email;
              const displayName = info.profile.displayName;
              const username = info.result.fullProfile.userPrincipalName || info.result.fullProfile.mailNickname;
              
              // Use email local part as userId, fallback to username or displayName
              let userId;
              if (email) {
                [userId] = email.split('@');
              } else if (username) {
                userId = username;
              } else if (displayName) {
                userId = displayName.replace(/\s+/g, '').toLowerCase();
              } else {
                throw new Error('User profile contained no valid email, username, or display name');
              }

              console.log(`Microsoft user ID: ${userId}`);

              // You can add custom validation logic here
              // For example, check if the user belongs to your organization
              // if (!email?.endsWith('@yourcompany.com')) {
              //   throw new Error('Only users from yourcompany.com are allowed');
              // }

              const userEntity = stringifyEntityRef({
                kind: 'User',
                name: userId,
                namespace: 'default',
              });

              return ctx.issueToken({
                claims: {
                  sub: userEntity,
                  ent: [userEntity]
                },
              });
            },
          }),
        });
      },
    });
  },
});

backend.add(customAuth);
backend.start();