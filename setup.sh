sudo snap install docker
sudo chown $USER /var/run/docker.sock
cd backend 
docker build -t backend .
cd ../frontend
docker build -t frontend .
cd ..
docker run -d -p 3000:3000 -e  backend
docker run -d -p 80:80 frontend