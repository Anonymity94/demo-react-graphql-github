import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Link from '../Link';
import Button from '../Button';

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
      {/* star人数 */}
      <div>
        {/* 变量（Variables） */}
        {/* @see: https://graphql.org.cn/learn/queries-variables.html */}
        {!viewerHasStarred ? (
          <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
            {(addStar, { data, loading, error }) => (
              <Button className="RepositoryItem-title-action" onClick={addStar}>
                {stargazers.totalCount} Stars
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={REMOVE_STAR_REPOSITORY} variables={{ id }}>
            {(removeStar, { data, loading, error }) => (
              <Button className="RepositoryItem-title-action" onClick={removeStar}>
                UnStar
              </Button>
            )}
          </Mutation>
        )}
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
