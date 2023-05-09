import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import React from 'react';
import Section from '../components/Section';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../graphql';

type Props = {
  mainTypeId: string;
  queryParams: any;
  history: any;
  type?: string;
};

type FinalProps = {
  getQuestions: any;
  addRcfaQuestions: any;
} & Props;

class SectionContainer extends React.Component<FinalProps> {
  state: any = {};

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      id: props.id
    };
  }

  render() {
    const { getQuestions, addRcfaQuestions } = this.props;

    let questions = [];
    if (!getQuestions.loading) {
      questions = getQuestions.rcfaQuestions;
    }

    const createQuestion = (title: string) => {
      const payload = {
        title,
        mainType: 'ticket',
        mainTypeId: this.props.mainTypeId
      };
      console.log('^^^', payload);

      addRcfaQuestions(payload);
    };

    return (
      <Section
        ticketId={this.state.id}
        questions={questions}
        createQuestion={createQuestion}
      />
    );
  }
}

export const refetchQueries = ({ mainTypeId }) => [
  {
    query: gql(queries.getQuestions),
    variables: {
      mainType: 'ticket',
      mainTypeId: mainTypeId
    }
  }
];

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.getQuestions), {
      name: 'getQuestions',
      options: (props: any) => ({
        variables: {
          mainType: 'ticket',
          mainTypeId: props.mainTypeId
        }
      })
    }),
    graphql<Props>(gql(mutations.add), {
      name: 'addRcfaQuestions'
    })
  )(SectionContainer)
);
