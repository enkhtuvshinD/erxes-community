import React from 'react';
import Form from '../../components/QuizForm';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom';

const MUT = gql`
  mutation ForumQuizCreate(
    $categoryId: ID
    $companyId: ID
    $description: String
    $name: String
    $postId: ID
    $tagIds: [ID!]
  ) {
    forumQuizCreate(
      categoryId: $categoryId
      companyId: $companyId
      description: $description
      name: $name
      postId: $postId
      tagIds: $tagIds
    ) {
      _id
    }
  }
`;

const QuizNew = () => {
  const [mutation] = useMutation(MUT, {
    refetchQueries: ['ForumQuizzes']
  });
  const history = useHistory();

  const onSubmit = async variables => {
    try {
      await mutation({ variables });
      history.push('/forums/quizzes');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <Form onSubmit={onSubmit} />
    </div>
  );
};

export default QuizNew;
