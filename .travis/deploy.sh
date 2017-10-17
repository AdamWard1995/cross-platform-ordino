#!/bin/bash

set -ev;

if [ ${TRAVIS_BRANCH} = "master"] && [${TRAVIS_PULL_REQUEST} = "false"]; then
  cat coverage/lcov.info | coveralls
  ember build
  firebase deploy --token "$FIREBASE_TOKEN"
fi

exit 0;
