#!/bin/sh

if [ -z "`which github-changes`" ]; then
  echo "First, do: [sudo] npm install -g github-changes@1.1.2"
  exit 1
fi

if [ -d .git/refs/remotes/upstream ]; then
  remote=upstream
else
  remote=origin
fi

# Increment v2.x.y -> v2.x+1.0
npm version minor || exit 1

echo $remote

# Generate changelog from pull requests
github-changes -o request -r request \
  --auth --verbose \
  --file CHANGELOG.md \
  --only-pulls --use-commit-body \
  --date-format '(YYYY/MM/DD)' \
  || exit 1
