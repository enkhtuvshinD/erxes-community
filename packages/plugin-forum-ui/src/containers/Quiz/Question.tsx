import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';
import Form from '../../components/QuizQuestionForm';
import QuizChoiceForm from '../../components/QuizChoiceForm';
import ChoiceDetail from './Choice';

const QUERY = gql`
  query ForumQuizQuestion($_id: ID!) {
    forumQuizQuestion(_id: $_id) {
      _id
      choices {
        _id
        imageUrl
        isCorrect
        listOrder
        questionId
        quizId
        text
      }
      imageUrl
      isMultipleChoice
      listOrder
      quizId
      text
    }
  }
`;

const PATCH = gql`
  mutation ForumQuizQuestionPatch(
    $_id: ID!
    $imageUrl: String
    $isMultipleChoice: Boolean
    $listOrder: Float
    $text: String
  ) {
    forumQuizQuestionPatch(
      _id: $_id
      imageUrl: $imageUrl
      isMultipleChoice: $isMultipleChoice
      listOrder: $listOrder
      text: $text
    ) {
      _id
    }
  }
`;

const CREATE_CHOICE = gql`
  mutation ForumQuizChoiceCreate(
    $isCorrect: Boolean!
    $listOrder: Float!
    $questionId: ID!
    $quizId: ID!
    $imageUrl: String
    $text: String
  ) {
    forumQuizChoiceCreate(
      isCorrect: $isCorrect
      listOrder: $listOrder
      questionId: $questionId
      quizId: $quizId
      imageUrl: $imageUrl
      text: $text
    ) {
      _id
    }
  }
`;

const QuestionDetail: React.FC<{ _id: string; index: number }> = ({
  _id,
  index
}) => {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      _id
    }
  });

  const [patch] = useMutation(PATCH, {
    onCompleted: refetch
  });

  const [createChoice] = useMutation(CREATE_CHOICE, {
    onCompleted: refetch
  });

  const [showForm, setShowForm] = useState(false);
  const [showChoiceForm, setShowChoiceForm] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const question = data.forumQuizQuestion;

  const onEditSubmit = async variables => {
    await patch({
      variables: {
        ...variables,
        _id
      }
    });
    setShowForm(false);
  };

  const onNewChoice = async variables => {
    await createChoice({
      variables: {
        ...variables,
        questionId: _id,
        quizId: question.quizId
      }
    });
    setShowChoiceForm(false);
  };

  return (
    <div>
      <Form
        question={question}
        show={showForm}
        onCancel={() => setShowForm(false)}
        onSubmit={onEditSubmit}
      />
      <QuizChoiceForm
        onCancel={() => setShowChoiceForm(false)}
        show={showChoiceForm}
        onSubmit={onNewChoice}
      />
      <h2>
        {index + 1}. {question.text}{' '}
        {question.isMultipleChoice ? '(Multiple choice)' : ''}{' '}
        <button type="button" onClick={() => setShowForm(true)}>
          Edit
        </button>
        <button type="button" onClick={() => setShowChoiceForm(true)}>
          Add choice
        </button>
      </h2>

      <div style={{ paddingLeft: 40 }}>
        {question.choices?.length
          ? question.choices.map((c, i) => (
              <ChoiceDetail key={c._id} choice={c} index={i} />
            ))
          : 'No choices'}
      </div>
    </div>
  );
};

export default QuestionDetail;
