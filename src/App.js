import React from 'react'
import axios from 'axios'

const TITLE = 'React GraphQL GitHub Client'

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
})

const GET_LOGIN = `
{
  viewer {
    login
    name
    bio
    avatarUrl
  }
}
`

function App() {
  axiosGitHubGraphQL
    .post('', { query: GET_LOGIN })
    .then(result => console.log(result))

  return (
    <div className="App">
      <h1>{TITLE}</h1>
    </div>
  )
}

export default App
