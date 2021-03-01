#!/usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const execa = require('execa')
var CachemanFile = require('cacheman-file')
const util = require('util')

const fetchRepos = require('../src/fetch-repos')
const getFile = require('../src/get-file')

const cache = new CachemanFile({})
const cacheGet = util.promisify(cache.get.bind(cache))
const cacheSet = util.promisify(cache.set.bind(cache))

const setupGlobalVariables = () => {
  global.githubToken = process.env['GITHUB_TOKEN']

  if (!global.githubToken) {
    return console.log('A valid Github token is required. Use GITHUB_TOKEN=');
  }
}

const freeFormSearch = async (res, filename, userAdditionalAnswers) => {
  for (repoResult of res) {
    console.log('Repository:', repoResult.name)

    if (!repoResult[filename]) {
      console.log(`/tFila ${filename} was not found`)
      continue
    }

    const grep = execa('grep', [userAdditionalAnswers.searchText])
    grep.stdout.pipe(process.stdout)

    const echo = execa('echo', [repoResult[filename]])
    echo.stdout.pipe(grep.stdin)

    try {
      await Promise.all([grep, echo])
    } catch (e) {
      // this can happen if nothing is found in grep command
    }
  }
}

const dependenciesVersions = (res, filename, userAdditionalAnswers) => {
  for (repoResult of res) {
    console.log('Repository:', repoResult.name)
    const packageJson = JSON.parse(repoResult[filename])
    const version = packageJson.dependencies[userAdditionalAnswers.dependencyName]
      || packageJson.devDependencies[userAdditionalAnswers.dependencyName]
    console.log(`/t${userAdditionalAnswers.dependencyName}: `, version)
  }
}

program
  .command('search')
  .description('Search for something in your org')
  .action(async function () {
    setupGlobalVariables()

    const userAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'org',
        message: 'Organization to search:',
        default: 'Toptal'
      },
      {
        type: 'list',
        name: 'searchType',
        message: 'What are you looking for?',
        choices: [
          'Get dependency versions',
          'Free-form search'
        ]
      }
    ])

    let userAdditionalAnswers
    if (userAnswers.searchType === 'Free-form search') {
      userAdditionalAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'filename',
          message: 'File to check:',
          default: 'package.json'
        },
        {
          type: 'input',
          name: 'searchText',
          message: 'Text to search:'
        }
      ])
    } else if (userAnswers.searchType === 'Get dependency versions') {
      userAdditionalAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'dependencyName',
          message: 'Dependency:'
        }
      ])
    }

    try {
      const fileName = userAdditionalAnswers.filename || 'package.json'
      let reposWithFile = await cacheGet(`repos-${fileName}`)
      let repos

      if (!reposWithFile) {
        repos = await fetchRepos(userAnswers.org)
        console.log('Found ', repos.length, ' repos')

        const newReposWithFile = await getFile(
          repos,
          fileName
        )

        await cacheSet(
          `repos-${fileName}`,
          newReposWithFile,
          60*60*12 // 12 hours
        )

        reposWithFile = newReposWithFile
      }

      if (userAnswers.searchType === 'Free-form search') {
        await freeFormSearch(reposWithFile, fileName, userAdditionalAnswers)
      } else if (userAnswers.searchType === 'Get dependency versions') {
        dependenciesVersions(reposWithFile, fileName, userAdditionalAnswers)
      }
    } catch (err) {
      console.log('\nError: \t', err);
    }
  })

program.parse(process.args)
