import {
  Customers,
  Conversations,
  ConversationMessages,
  IConversation,
  IConversationMessages
} from '../models';
import { sendInboxMessage } from '../messageBroker';
import { graphqlPubsub } from '../configs';

interface IWebhookMessage {
  event: string;
  timestamp: number;
  sender: {
    id: string;
    name: string;
    country: string;
  };
  message: {
    text: string;
    type: string;
  };
}

const messageListen = async (
  message: IWebhookMessage,
  integrationId: string,
  subdomain: string
): Promise<void> => {
  const customer = await Customers.getOrCreate(
    {
      inboxIntegrationId: integrationId,
      contactsId: null,
      instagramId: message.sender.id,
      name: message.sender.name,
      country: message.sender.country
    },
    subdomain
  );

  let conversation: IConversation | null = await Conversations.findOne({
    senderId: message.sender.id,
    integrationId
  });

  if (!conversation) {
    try {
      conversation = await Conversations.create({
        timestamp: message.timestamp,
        senderId: message.sender.id,
        recipientId: null,
        integrationId
      });
    } catch (e) {
      throw new Error(
        e.message.includes('duplicate')
          ? 'Concurrent request: conversation duplication'
          : e
      );
    }

    try {
      const apiConversationResponse = await sendInboxMessage({
        subdomain,
        action: 'integrations.receive',
        data: {
          action: 'create-or-update-conversation',
          payload: JSON.stringify({
            customerId: customer.contactsId,
            integrationId,
            content: message.message.text || '',
            attachments: null,
            conversationId: conversation.erxesApiId,
            updatedAt: message.timestamp
          })
        },
        isRPC: true
      });

      conversation.erxesApiId = apiConversationResponse._id;

      await conversation.save();
    } catch (e) {
      throw new Error(e);
    }
  }

  try {
    const conversationMessage: IConversationMessages = await ConversationMessages.create(
      {
        conversationId: conversation._id,
        createdAt: message.timestamp,
        userId: null,
        customerId: customer.contactsId,
        content: message.message.text,
        messageType: message.message.type
      }
    );

    await sendInboxMessage({
      subdomain,
      action: 'conversationClientMessageInserted',
      data: {
        ...conversationMessage.toObject(),
        conversationId: conversation.erxesApiId
      }
    });

    graphqlPubsub.publish('conversationClientMessageInserted', {
      conversationClientMessageInserted: {
        ...conversationMessage.toObject(),
        conversationId: conversation.erxesApiId
      }
    });

    graphqlPubsub.publish('conversationMessageInserted', {
      conversationMessageInserted: {
        ...conversationMessage.toObject(),
        conversationId: conversation.erxesApiId
      }
    });
  } catch (e) {
    throw new Error(e);
  }
};

export default messageListen;
