// This is a failed attempt at using
// Github API to search for package usages
// in an organization's repos

// Note: Number of results is always different

import { Octokit } from '@octokit/rest'
import fs from 'fs'

// Octokit.js
// https://github.com/octokit/core.js#readme

const setupGlobalVariables = () => {
  global.githubToken = process.env['GITHUB_TOKEN']

  if (!global.githubToken) {
    return console.log('A valid Github token is required. Use GITHUB_TOKEN=');
  }
}

async function run(fxPackage: string) {
  setupGlobalVariables()
  const octokit = new Octokit({ auth: process.env['GITHUB_TOKEN'] });

  const q = `"${fxPackage}"+org:toptal+filename:"package.json"`

  const result = await octokit.rest.search.code({
    q
  });

  const jsonResult = JSON.stringify(result, null, 4)

  fs.writeFile('./results.txt', jsonResult, err => {
    if (err) {
      console.error(err);
    }
    else console.log('done')
  });
}

run('@toptal/davinci')
