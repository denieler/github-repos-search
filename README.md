
# github-repos-search

Search organization repos files content

# Usage

```
GITHUB_TOKEN={your token} node ./bin/repos.js search
```

even better on OSX:

```
GITHUB_TOKEN=$(security find-generic-password -a ${USER} -l GITHUB_TOKEN -w) node ./bin/repos.js search
```
[How to add a key to OSX keychain](https://www.netmeister.org/blog/keychain-passwords.html)
