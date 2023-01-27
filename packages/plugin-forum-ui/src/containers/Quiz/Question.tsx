import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';

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

const QuestionDetail: React.FC<{ _id: string; index: number }> = ({
  _id,
  index
}) => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      _id
    }
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const question = data.forumQuizQuestion;

  return (
    <div>
      <h2>
        {index + 1}. {question.text}
      </h2>
    </div>
  );
};

export default QuestionDetail;
