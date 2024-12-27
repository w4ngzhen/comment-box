#!/bin/sh
pnpm run build:all
rm -rf dist
mkdir dist
cp ./packages/comment-box-advance/dist/** dist
cp ./packages/comment-box-lite/dist/** dist
# remove html file.
find ./dist -type f -name "*.html" -delete