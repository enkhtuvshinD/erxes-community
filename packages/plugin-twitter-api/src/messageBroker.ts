import * as dotenv from 'dotenv';
import {
  ISendMessageArgs,
  sendMessage as sendCommonMessage
} from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import { generateModels } from './connectionResolver';

dotenv.config();

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeRPCQueue } = client;

  consumeRPCQueue(
    'imap:createIntegration',
    async ({ subdomain, data: { doc, integrationId } }) => {
      const models = await generateModels(subdomain);

      await models.Integrations.create({
        inboxId: integrationId,
        ...(doc || {})
      });

      return {
        status: 'success'
      };
    }
  );
};

export default function() {
  return client;
}

export const sendContactsMessage = (args: ISendMessageArgs) => {
  return sendCommonMessage({
    client,
    serviceDiscovery,
    serviceName: 'contacts',
    ...args
  });
};

export const sendInboxMessage = (args: ISendMessageArgs) => {
  return sendCommonMessage({
    client,
    serviceDiscovery,
    serviceName: 'inbox',
    ...args
  });
};
export const sendRPCMessage = async (message): Promise<any> => {
  return client.sendRPCMessage('rpc_queue:integrations_to_api', message);
};
