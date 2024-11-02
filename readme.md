##ReadMe


###To run project from within instance:
Start Instance on aws
cd crack-api
./setup.sh
docker compose up


###Files to upload for cracking:
link to google drive containing files: https://drive.google.com/drive/folders/1beR_-7FoLD18yqg4GhuSepIyQBePq3Z4?usp=sharing
To achieve a crack time of greater then 5 mins do a mask of 10 *decimals* (decimals only) to any file. This will likely not crack the file but will give a cpu intense period (90%+) longer then 5 mins.


###Additional:

####Method to create password protected files:
echo -n "mypassword" | sha512sum | cut -f1 -d" " > secret.hash
hashcat -a 3 -m 1700 --status --status-timer 10 --outfile outfile secret.hash ?l?l?l?l?l?l?l?l?l?l
x=5; y=5; for i in $(seq 1 $x); do hex_string=$(openssl rand -hex $((y/2))); echo -n "$hex_string" | sha512sum | cut -f1 -d" " > "secret-$hex_string.hash"; done


####Run frontend individually:
cd into frontend directory 
http-server -c1

####Run backend individually:
cd into backend directory
node server.js




When wanting to upload to ecr do the following:
git add -A
git commit -m ""
git push
./push-to-ecr.sh
./up-task.sh

if denied: Your authorization token has expired. Reauthenticate and try again. run:
aws configure sso
./login.sh


to run on local:

