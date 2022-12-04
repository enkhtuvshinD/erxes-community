import { isEnabled } from '@erxes/ui/src/utils/core';

const commonParamsDef = `
  $channelId: String,
  $brandId: String,
  $kind: String,
  $perPage: Int,
  $page: Int,
  $searchValue: String
  $status: String
`;

const commonParams = `
  channelId: $channelId,
  brandId: $brandId,
  kind: $kind,
  perPage: $perPage,
  page: $page,
  searchValue: $searchValue
  status: $status
`;

const commonFields = `
  _id
  name
  brandId
  languageCode
  isActive
  channels {
    _id
    name
  }
`;

const brands = `
  query brands {
    brands {
      _id
      name
      code
      description
    }
  }
`;

const integrationTotalCount = `
  query totalIntegrationsCount {
    integrationsTotalCount {
      total
      byKind
    }
  }
`;

const integrationsGetConfigs = `
  query integrationsGetConfigs {
    integrationsGetConfigs
  }
`;

const integrationsGetIntegrationDetail = `
  query integrationsGetIntegrationDetail($erxesApiId: String) {
    integrationsGetIntegrationDetail(erxesApiId: $erxesApiId)
  }
`;

const getAccounts = `
  query twitterGetAccounts($kind: String) {
    twitterGetAccounts(kind: $kind)
  }
`;

const integrationsGetIntegrations = `
  query integrationsGetIntegrations($kind: String) {
    integrationsGetIntegrations(kind: $kind)
  }
`;

const integrationsGetTwitterAccount = `
  query integrationsGetTwitterAccount($accountId: String!) {
    integrationsGetTwitterAccount(accountId: $accountId)
  }
`;

const integrations = `
  query integrations(${commonParamsDef}) {
    integrations(${commonParams}) {
      ${commonFields}
      kind
      brand {
        _id
        name
        code
      }
      webhookData
      leadData
      formId
      tagIds
      tags {
        _id
        colorCode
        name
      }
      form {
        _id
        title
        code
      }
      healthStatus
    }
  }
`;

const detail = `
  query twitterConversationDetail($conversationId: String!) {
      twitterConversationDetail(conversationId: $conversationId) {
          _id
          data
      }
  }
`;

const accounts = `
  query twitterAccounts {
    twitterAccounts 
  }
`;

const getTwitterConversationMessages = `
  query getTwitterConversationMessages($conversationId: String!) {
    getTwitterConversationMessages(conversationId: $conversationId) {
      _id
      content
    }
  }
`;

export default {
  brands,
  integrations,
  integrationTotalCount,
  integrationsGetConfigs,
  integrationsGetIntegrationDetail,
  getAccounts,
  integrationsGetIntegrations,
  integrationsGetTwitterAccount,
  detail,
  accounts,
  getTwitterConversationMessages
};
