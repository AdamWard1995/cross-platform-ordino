cat coverage/lcov.info | coveralls
ember build
firebase deploy --token "$FIREBASE_TOKEN"
