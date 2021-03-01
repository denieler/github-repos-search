const request = require('request')

const url = path => `https://api.github.com/${path}`

const fetch = opts => {
  const req = request.defaults({
    headers: {
      'Authorization': `token ${global.githubToken}`,
      'User-Agent': 'github-repos-search'
    },
    qs: {
      'per_page': 100
    }
  })

  return new Promise((resolve, reject) => {
    req.get(opts, (err, res, body) => {
      if (err) reject(err)
      const statusCode = res.statusCode

      if (+res.headers['x-ratelimit-remaining'] === 0) {
        let resetTimestamp = res.headers['x-ratelimit-reset'] * 1000
        let resetTime = new Date(resetTimestamp)
        reject(`Github shut us off. Access will be restored at ${resetTime}`)
      }

      resolve({
        headers: res.headers,
        json: JSON.parse(body),
        statusCode: statusCode
      })
    })
  })
}

module.exports = {
  fetch,
  url
}
