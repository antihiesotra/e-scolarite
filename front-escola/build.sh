#!/bin/sh

echo "Building ESCOLA"
npm run build

echo "deleting old ESCOLA"
sudo rm -R /var/www/escola

echo "moving ESCOLA"
sudo mv dist /var/www/escola

echo "Build and move finished"
