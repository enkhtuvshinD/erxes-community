import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo';

const LIST_QUERY = gql`
  query ForumQuizzes($limit: Int, $offset: Int, $sort: JSON) {
    forumQuizzes(limit: $limit, offset: $offset, sort: $sort) {
      _id
      name
      description
      company {
        primaryName
      }
      post {
        _id
        title
      }
      category {
        _id
        name
      }
    }
  }
`;

const QuizList: React.FC<{}> = () => {
  const { data, loading, error } = useQuery(LIST_QUERY, {
    variables: {
      sort: {
        _id: -1
      }
    }
  });
  if (loading) return null;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Company</th>
            <th>Post</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {data.forumQuizzes.map((quiz: any) => (
            <tr key={quiz._id}>
              <td>{quiz.name}</td>
              <td>{quiz.description}</td>
              <td>
                {quiz.company?.primaryName ? quiz.company?.primaryName : ''}
              </td>
              <td>{quiz.post?.title ? quiz.post?.title : ''}</td>
              <td>{quiz.category?.name ? quiz.category.name : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizList;
