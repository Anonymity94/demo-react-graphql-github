import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import REPOSITORY_FRAGMENT from './fragments';
import Link from '../Link';
import Button from '../Button';

// Star
const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const updateAddStar = (
  client,
  {
    data: {
      addStar: {
        starrable: { id },
      },
    },
  }
) => {
  console.log('client', client);
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });
  const totalCount = repository.stargazers.totalCount + 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

// UnStar
// @see: https://developer.github.com/v4/mutation/removestar/
const REMOVE_STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const updateRemoveStar = (
  client,
  {
    data: {
      removeStar: {
        starrable: { id },
      },
    },
  }
) => {
  console.log('client', client);
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });
  const totalCount = repository.stargazers.totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      stargazers: {
        ...repository.stargazers,
        totalCount,
      },
    },
  });
};

// Watch
// @see: https://developer.github.com/v4/mutation/updatesubscription/
const WATCH_REPOSITORY = gql`
  mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(input: { state: $viewerSubscription, subscribableId: $id }) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = viewerSubscription => viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;

  totalCount =
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED ? totalCount + 1 : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
  <div>
    <div className="RepositoryItem-title">
      {/* 仓库标题 */}
      <h2>
        <Link href={url}>{name}</Link>
      </h2>
      <div>
        {/* Star */}
        {/* 变量（Variables） */}
        {/* @see: https://graphql.org.cn/learn/queries-variables.html */}
        {!viewerHasStarred ? (
          <Mutation mutation={STAR_REPOSITORY} variables={{ id }} update={updateAddStar}>
            {(addStar, { data, loading, error }) => (
              <Button className="RepositoryItem-title-action" onClick={addStar}>
                Stars {stargazers.totalCount}
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={REMOVE_STAR_REPOSITORY} variables={{ id }} update={updateRemoveStar}>
            {(removeStar, { data, loading, error }) => (
              <Button className="RepositoryItem-title-action" onClick={removeStar}>
                UnStar {stargazers.totalCount}
              </Button>
            )}
          </Mutation>
        )}

        {/* Watch */}
        <Mutation
          mutation={WATCH_REPOSITORY}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
          }}
          update={updateWatch}
          // @see: https://www.apollographql.com/docs/react/performance/optimistic-ui/#basic-optimistic-ui
          optimisticResponse={{
            updateSubscription: {
              __typename: 'Mutation',
              subscribable: {
                __typename: 'Repository',
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
              },
            },
          }}
        >
          {(viewerSubscription, { data, loading, error }) => (
            <Button className="RepositoryItem-title-action" onClick={viewerSubscription}>
              {watchers.totalCount} {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
            </Button>
          )}
        </Mutation>
      </div>
    </div>
    <div className="RepositoryItem-description">
      {/* 仓库描述 */}
      <div
        className="RepositoryItem-description-info"
        dangerouslySetInnerHTML={{ __html: descriptionHTML }}
      />

      <div className="RepositoryItem-description-details">
        {/* 语言 */}
        <div>{primaryLanguage && <span>Language: {primaryLanguage.name}</span>}</div>
        {/* 所属人 */}
        <div>
          {owner && (
            <span>
              Owner: <a href={owner.url}>{owner.login}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
