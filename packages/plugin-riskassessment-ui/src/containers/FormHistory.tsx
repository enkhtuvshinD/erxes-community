import { Spinner, withProps } from '@erxes/ui/src';
import React from 'react';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { queries } from '../graphql';
import FormHistoryComponent from '../components/FormHistory';

type Props = {
  riskAssessmentId: string;
};

type FinalProps = {
  riskAssessmentHistory: any;
} & Props;

class FormHistory extends React.Component<FinalProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { riskAssessmentHistory } = this.props;

    if (riskAssessmentHistory.loading) {
      return <Spinner />;
    }

    return <FormHistoryComponent detail={riskAssessmentHistory.riskFormSubmitHistory || []} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.assessmentHistory), {
      name: 'riskAssessmentHistory',
      options: ({ riskAssessmentId }) => ({
        variables: { riskAssessmentId }
      })
    })
  )(FormHistory)
);