#!/bin/sh
pnpm run build:all
rm -rf dist
mkdir dist
tree -I "node_modules"
cp packages/comment-box-advance/dist/**/*.js dist
cp packages/comment-box-advance/dist/**/*.css dist
cp packages/comment-box-lite/dist/**/*.js dist
cp packages/comment-box-lite/dist/**/*.css dist
