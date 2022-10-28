module.exports = {
  name: 'twitter',
  scope: 'twitter',
  port: 3015,
  exposes: {
    './routes': './src/routes.tsx',
    './inboxIntegrationSettings': './src/components/IntegrationSettings.tsx',
    './inboxIntegrationForm': './src/components/Twitter.tsx',
    './inboxConversationDetail': './src/components/Twitter.tsx'
  },
  routes: {
    url: 'http://localhost:3015/remoteEntry.js',
    scope: 'twitter',
    module: './routes'
  },
  inboxIntegrationSettings: './inboxIntegrationSettings',
  inboxIntegrationForm: './inboxIntegrationForm',
  inboxConversationDetail: './inboxConversationDetail',
  inboxIntegration: {
    name: 'Twitter',
    description: '',
    inMessenger: false,
    isAvailable: true,
    kind: 'twitter',
    logo: '/images/integrations/twitter.png',
    createModal: 'twitter',
    createUrl: '/settings/integrations/twitter',
    category:
      'All integrations, For support teams, Marketing automation, Email marketing'
  }
};