import React, { FC, useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Choice } from '../../components/QuizChoiceForm';

// const MUT = gql``;

type Props = {
  choice: Choice;
  onEdit?(): any;
  index?: number;
};

const ChoiceDetail: FC<Props> = ({ choice, onEdit, index }) => {
  const { _id, questionId, ...editable } = choice;
  return (
    <div>
      <h3>
        {choice.isCorrect && ' ✓ '}
        {index != null && `${index + 1}. `}
        {choice.text}
      </h3>
    </div>
  );
};

export default ChoiceDetail;
