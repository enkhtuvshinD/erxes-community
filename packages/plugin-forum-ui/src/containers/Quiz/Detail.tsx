import React from 'react';
import { useQuery } from 'react-apollo';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';

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

const QuizDetail: React.FC<{}> = () => {
  const { quizId } = useParams();

  const { data, loading, error } = useQuery(QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      id: quizId
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }

  const quiz = data.forumQuiz;

  console.log(quiz);

  return (
    <div>
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
    </div>
  );
};

export default QuizDetail;
