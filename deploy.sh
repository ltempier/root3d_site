#!/bin/bash

# Set server URL and paths
SERVER_URL="app.v45e.com"
GIT_PATH="/home/ltr/Git"
DOCKER_COMPOSE_FILE="$GIT_PATH/DockerCompose/docker-compose.yml"
ROOT3D_SITE_PATH="$GIT_PATH/root3d_site"

echo "****** PUSH TO GIT ******"
git add .
git commit -am 'from deploy.sh'
git push

echo "****** STOP DOCKER root3d ******"
ssh ltr@$SERVER_URL docker compose -f $DOCKER_COMPOSE_FILE stop root3d

echo "****** PULL FROM GIT ******"
ssh ltr@$SERVER_URL git -C "$ROOT3D_SITE_PATH" fetch
ssh ltr@$SERVER_URL git -C "$ROOT3D_SITE_PATH" stash
ssh ltr@$SERVER_URL git -C "$ROOT3D_SITE_PATH" pull --rebase

echo "****** DOCKER UP root3d ******"
ssh ltr@$SERVER_URL docker compose -f $DOCKER_COMPOSE_FILE up -d root3d
