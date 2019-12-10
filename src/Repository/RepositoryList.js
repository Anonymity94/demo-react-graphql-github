import React, { Fragment } from 'react';
import RepositoryItem from './RepositoryItem';
import FetchMore from '../FetchMore';

const updateQuery = (preResult, { fetchMoreResult }) => {
  console.log('fetchMoreResult', fetchMoreResult);

  if (!fetchMoreResult) {
    return preResult;
  }

  return {
    ...preResult,
    viewer: {
      ...preResult.viewer,
      repositories: {
        ...preResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...preResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};

const RepositoryList = ({ repositories, fetchMore, loading }) => (
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))}
    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      fetchMore={fetchMore}
      variables={{ cursor: repositories.pageInfo.endCursor }}
      updateQuery={updateQuery}
    >
      Repositories
    </FetchMore>
  </Fragment>
);

export default RepositoryList;
