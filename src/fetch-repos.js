const _ = require('underscore')

const { fetch, url } = require('./gh-fetch')

const fetchOrgReposByPage = (org, page) => {
  let opts = {
    uri: url(['orgs', org, 'repos'].join('/')),
    qs: {
      page: page
    }
  }

  return fetch(opts)
}

const getPaginateHeaderData = headerStr => {
  const nextRegExp = new RegExp(/repos\?per_page=100\&page=(\d+)\>\; rel=\"next\"/)
  const lastRegExp = new RegExp(/repos\?per_page=100\&page=(\d+)\>\; rel=\"last\"/)

  const nextMatch = headerStr.match(nextRegExp)
  const lastMatch = headerStr.match(lastRegExp)

  return {
    next: +nextMatch[1] || undefined,
    last: +lastMatch[1] || undefined
  }
}


const fetchAllOrgRepos = org => {
  console.log(`Fetching all repos from ${org}`)

  return fetchOrgReposByPage(org, 1)
    .then(val => {
      let repos = [].concat(val.json)
      let pagination = getPaginateHeaderData(val.headers.link)

      let promises = _.range(2, pagination.last + 1).map((p) => {
        return fetchOrgReposByPage(org, p)
      })

      return Promise.all(promises).then((values) => {
        let rs = _.flatten(values.map((v) => v.json))
        return repos.concat(rs)
      })
    })
    .then(repos => {
      console.log(`\nFound ${repos.length} repos`);
      return repos.map((r) => ({
        id: r.id,
        name: r.name,
        language: r.language,
        org
      }))
    })
}

module.exports = fetchAllOrgRepos
