import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import Form from '../../components/QuizQuestionForm';
import Question from './Question';

const QUERY = gql`
  query ForumQuiz($id: ID!) {
    forumQuiz(_id: $id) {
      _id
      category {
        _id
        name
      }
      company {
        _id
        primaryEmail
        primaryName
        primaryPhone
      }
      description
      isLocked
      name
      post {
        _id
        title
      }
      questions {
        _id
      }
      state
      tags {
        _id
        name
      }
    }
  }
`;

const MUT_CREATE = gql`
  mutation ForumQuizQuestionCreate(
    $isMultipleChoice: Boolean!
    $listOrder: Float!
    $quizId: ID!
    $imageUrl: String
    $text: String
  ) {
    forumQuizQuestionCreate(
      isMultipleChoice: $isMultipleChoice
      listOrder: $listOrder
      quizId: $quizId
      imageUrl: $imageUrl
      text: $text
    ) {
      _id
    }
  }
`;

const QuizDetail: React.FC<{}> = () => {
  const { quizId } = useParams();
  const [showForm, setShowForm] = useState(false);

  const { data, loading, error } = useQuery(QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      id: quizId
    }
  });

  const [mutCreate] = useMutation(MUT_CREATE, {
    refetchQueries: ['ForumQuiz']
  });

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }

  const quiz = data.forumQuiz;

  console.log(quiz);

  const onCreateSubmit = async variables => {
    await mutCreate({
      variables: {
        ...variables,
        quizId
      }
    });
    setShowForm(false);
  };

  return (
    <div>
      <Form
        show={showForm}
        onSubmit={onCreateSubmit}
        onCancel={() => setShowForm(false)}
      />
      <table>
        <tbody>
          <tr>
            <th>Name: </th>
            <td>{quiz.name}</td>
          </tr>
          <tr>
            <th>Description: </th>
            <td>{quiz.description}</td>
          </tr>
          <tr>
            <th>State: </th>
            <td>{quiz.state}</td>
          </tr>
          {quiz.category && (
            <tr>
              <th>Category: </th>
              <td>{quiz.category.name}</td>
            </tr>
          )}
          {quiz.company && (
            <tr>
              <th>Company: </th>
              <td>
                {quiz.company.primaryName} {quiz.company.primaryEmail}{' '}
                {quiz.company.primaryPhone}
              </td>
            </tr>
          )}
          {quiz.post && (
            <tr>
              <th>Post: </th>
              <td>{quiz.post.title}</td>
            </tr>
          )}
          {(quiz.tags?.length || 0) > 0 ? (
            <tr>
              <th>Tags: </th>
              <td>
                {quiz.tags.map(t => (
                  <span>{t.name}</span>
                ))}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div>
        <h2>
          Questions <button onClick={() => setShowForm(true)}>+</button>
        </h2>

        <div style={{ paddingLeft: 30 }}>
          {(quiz.questions?.length || 0) > 0 ? (
            quiz.questions.map((q, i) => (
              <Question key={q._id} _id={q._id} index={i} />
            ))
          ) : (
            <div>No questions</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
