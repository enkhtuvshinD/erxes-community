import React from 'react';
import { withProps } from '@erxes/ui/src/utils/core';
import { IContract } from '../../types';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queries } from '@erxes/ui-cards/src/deals/graphql';
import Items from '@erxes/ui-cards/src/boards/components/portable/Items';
import options from '@erxes/ui-cards/src/deals/options';
import { IDeal } from '@erxes/ui-cards/src/deals/types';
import client from '@erxes/ui/src/apolloClient';
import { mutations as contractMutation } from '../../graphql';

interface Props {
  contract: IContract;
  dealsData?: { deals: IDeal[]; refetch: () => void };
}

function DealSection(props: Props) {
  const onChange: any = () => {
    console.log('onChange');
  };

  return (
    <Items
      items={props.dealsData?.deals || []}
      data={{ options: options }}
      onChangeItem={onChange}
      hideQuickButtons
    />
  );
}

export default withProps<Props>(
  compose(
    graphql<{}, any, any>(gql(queries.deals), {
      name: 'dealsData',
      options: ({ contract }: any): any => {
        return {
          variables: { _ids: [contract.dealId] }
        };
      }
    })
  )(DealSection)
);