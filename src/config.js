const process = require('process')

module.exports = {
  githubToken: process.env['GITHUB_TOKEN'],
  githubOrg: 'Toptal',
  depFiles: [
    'package.json'
  ],
  valuedDeps: [
    '@toptal/davinci',
    '@toptal/davinci-engine',
    '@toptal/davinci-syntax',
    '@toptal/davinci-code',
    '@toptal/davinci-qa',
    '@toptal/browserslist-config'
  ]
}
