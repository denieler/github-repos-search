const { fetch, url } = require('./gh-fetch')

const fetchJsonFileFromRepo = (repoOwnerName, repoName, filePath) => {
  console.log(`\tFetching ${filePath} for ${repoOwnerName}/${repoName}`)

  const path = ['repos', repoOwnerName, repoName, `contents/${filePath}`].join('/')
  return fetch({
    uri: url(path)
  })
}

function stringifyBase64(bstring) {
  let buf = Buffer.from(bstring, 'base64')
  return buf.toString()
}

const getFile = async (repos, filename) => {
  const results = []
  for (repo of repos) {
    const fileRequestResult = await fetchJsonFileFromRepo(
      repo.org,
      repo.name,
      filename
    )

    if (fileRequestResult.statusCode === 404) {
     continue
    }

    const content = stringifyBase64(fileRequestResult.json.content)
    results.push({
      ...repo,
      [filename]: content
    })
  }

  return results
}

module.exports = getFile
