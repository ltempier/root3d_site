
echo "****** PUSH TO GIT ******"
git add .
git commit -am 'from deploy.sh'
git push


echo "****** STOP DOCKER ******"
ssh ltr@app.v45e.com docker compose -f /home/ltr/Git/DockerCompose/docker-compose.yml stop root3d

ssh ltr@app.v45e.com git -C "/home/ltr/Git/root3d_site" fetch
ssh ltr@app.v45e.com git -C "/home/ltr/Git/root3d_site" stash
ssh ltr@app.v45e.com git -C "/home/ltr/Git/root3d_site" pull --rebase

echo "****** START DOCKER ******"
ssh ltr@app.v45e.com docker compose -f /home/ltr/Git/DockerCompose/docker-compose.yml up -d root3d