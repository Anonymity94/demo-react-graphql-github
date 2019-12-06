import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository';
import Loading from '../Loading';
import ErrorMessage from '../Error';

const GET_CURRENT_USER = gql`
  {
    viewer {
      login
      name
    }
  }
`;

// 内联片段（Inline Fragments）
// @see: http://anonymity94.github.io/articles/learn-graphql-via-github-api/#%E7%89%87%E6%AE%B5%EF%BC%88fragments%EF%BC%89
const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(first: 10, orderBy: { direction: DESC, field: STARGAZERS }) {
        edges {
          node {
            ...repository
          }
        }
      }
    }
  }
  
  ${REPOSITORY_FRAGMENT}
`;

const Profile = ({ data = {}, loading, error }) => {
  // 查询错误可以通过这样来捕获
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { viewer } = data;
  if (loading || !viewer) {
    return <Loading />;
  }

  return (
    <div>
      <RepositoryList repositories={viewer.repositories} />
    </div>
  );
};

export default graphql(GET_REPOSITORIES_OF_CURRENT_USER)(Profile);
