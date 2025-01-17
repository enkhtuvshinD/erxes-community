import React, { useEffect, useState } from 'react';
// erxes
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import PageContent from '@erxes/ui/src/layout/components/PageContent';
import EmptyContent from '@erxes/ui/src/components/EmptyState';
// local
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../containers/RightSidebar';
import MessageList from '../containers/messages/MessageList';
import Editor from '../containers/Editor';
import ReplyInfo from '../components/ReplyInfo';

import { PageContentWrapper } from '../styles';

type Props = {
  chatId: string;
};

const Chat = (props: Props) => {
  const { chatId } = props;
  const [reply, setReply] = useState<any>(null);

  useEffect(() => setReply(null), [chatId]);

  const renderContent = () => {
    if (chatId) {
      return (
        <PageContent transparent={false} center={true}>
          <PageContentWrapper>
            <MessageList chatId={chatId} setReply={setReply} />
            <ReplyInfo reply={reply} setReply={setReply} />
            <Editor chatId={chatId} reply={reply} setReply={setReply} />
          </PageContentWrapper>
        </PageContent>
      );
    } else {
      return (
        <EmptyContent
          icon="chat-1"
          text="Select a chat or start a new conversation"
        />
      );
    }
  };

  return (
    <Wrapper
      transparent={true}
      header={
        <Wrapper.Header title={'Chat'} breadcrumb={[{ title: 'Chat' }]} />
      }
      leftSidebar={<LeftSidebar chatId={chatId} />}
      rightSidebar={<RightSidebar chatId={chatId} />}
      content={renderContent()}
    />
  );
};

export default Chat;
