import React, { useState } from 'react';
import { useSearchParam } from '../hooks';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

export const QUIZ_STATES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export type QuizState = typeof QUIZ_STATES[number];

const QUERY_TAGS = gql`
  query Tags {
    tags(type: "forum:post") {
      _id
      colorCode
      name
    }
  }
`;

type Props = {
  quiz?: {
    _id: any;

    postId?: string | null;
    companyId?: string | null;
    tagIds?: string[] | null;
    categoryId?: string | null;

    name?: string | null;
    description?: string | null;

    isLocked: boolean;

    state: QuizState;
  };
  onSubmit?: (val: any) => any;
};

export const timeDuractionUnits = ['days', 'weeks', 'months', 'years'] as const;
export type TimeDurationUnit = typeof timeDuractionUnits[number];

const SubscriptionProductForm: React.FC<Props> = ({ quiz, onSubmit }) => {
  const [postId] = useSearchParam('postId');
  const [name, setName] = useState(quiz?.name || '');
  const [description, setDescription] = useState(quiz?.description || '');

  const initialCheckedTagIds = {};
  quiz?.tagIds?.forEach(id => {
    initialCheckedTagIds[id] = true;
  });

  const [checkedTagIds, setCheckedTagIds] = useState(initialCheckedTagIds);

  const tagsQuery = useQuery(QUERY_TAGS);

  const _onSubmit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={_onSubmit}>
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Description
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </label>

      <div>
        <h5>Tags</h5>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {tagsQuery.data?.tags?.map(tag => (
            <div style={{ margin: 5 }} key={tag._id}>
              <input
                checked={!!checkedTagIds[tag._id]}
                onChange={e => {
                  const checked = e.target.checked;
                  setCheckedTagIds(prev => {
                    const next = { ...prev };
                    next[tag._id] = checked;
                    return next;
                  });
                }}
                type="checkbox"
                id={`tcb-${tag._id}`}
              />{' '}
              <label style={{ userSelect: 'none' }} htmlFor={`tcb-${tag._id}`}>
                {tag.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <input type="submit" value="Submit" />
    </form>
  );
};

export default SubscriptionProductForm;
