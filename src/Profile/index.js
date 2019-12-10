import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Query } from 'react-apollo';
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

// 分页：https://developer.github.com/v4/object/pageinfo/
const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  query($cursor: String) {
    viewer {
      repositories(first: 10, orderBy: { direction: DESC, field: STARGAZERS }, after: $cursor) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

// Example1: use `graphql`

// Cursor-based
// @see: https://www.apollographql.com/docs/react/data/pagination/#cursor-based
// const Profile = ({ data = {}, loading, error, fetchMore }) => {
//   // eslint-disable-next-line no-undef
//   console.log(arguments);
//   console.log('fetchMore', fetchMore);
//   // 查询错误可以通过这样来捕获
//   if (error) {
//     return <ErrorMessage error={error} />;
//   }

//   const { viewer } = data;
//   if (loading || !viewer) {
//     return <Loading />;
//   }

//   return (
//     <div>
//       <RepositoryList repositories={viewer.repositories} fetchMore={fetchMore} />
//     </div>
//   );
// };
// export default graphql(GET_REPOSITORIES_OF_CURRENT_USER)(Profile);

// Example2
const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER} notifyOnNetworkStatusChange>
    {({ data = {}, loading, error, fetchMore }) => {
      // eslint-disable-next-line no-undef
      // 查询错误可以通过这样来捕获
      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { viewer } = data;
      if (loading && !viewer) {
        return <Loading />;
      }

      return (
        <div>
          <RepositoryList
            loading={loading}
            repositories={viewer.repositories}
            fetchMore={fetchMore}
          />
        </div>
      );
    }}
  </Query>
);

export default Profile;
