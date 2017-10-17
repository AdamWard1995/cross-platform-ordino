#!/bin/bash

if [ "$TRAVIS_BRANCH" = "master" -a "$TRAVIS_PULL_REQUEST" = "false" ]
  cat coverage/lcov.info | coveralls
  ember build
  firebase deploy --token "$FIREBASE_TOKEN"
fi
