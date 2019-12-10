import React from 'react';
import './style.css';
import Loading from '../Loading';

const FetchMore = ({ variables, updateQuery, fetchMore, hasNextPage, loading, children }) => (
  <div className="FetchMore">
    {loading ? (
      <Loading />
    ) : (
      hasNextPage && (
        <button
          type="button"
          className="FetchMore-button"
          onClick={() => fetchMore({ variables, updateQuery })}
        >
          Moore {children}
        </button>
      )
    )}
  </div>
);

export default FetchMore;
