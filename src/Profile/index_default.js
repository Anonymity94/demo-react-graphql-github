import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../Loading/index';
import RepositoryList from '../Repository';
import ErrorMessage from '../Error';

const GET_CURRENT_USER = gql`
  {
    viewer {
      login
      name
    }
  }
`;

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(first: 10, orderBy: { direction: DESC, field: STARGAZERS }) {
        edges {
          node {
            id
            name
            url
            descriptionHTML
            primaryLanguage {
              name
            }
            owner {
              login
              url
            }
            stargazers {
              totalCount
            }
            viewerHasStarred
            watchers {
              totalCount
            }
            viewerSubscription
          }
        }
      }
    }
  }
`;

const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
    {({ data = {}, loading, error }) => {
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
    }}
  </Query>
);

export default Profile;
