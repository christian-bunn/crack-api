hashcat -m 22000 -a 0 hashcat.hccapx rockyou.txt

hashcat -m 22000 --status --status-timer 10 --outfile cracked.lol -a 3 hashcat.hccapx hashc?l?l!

echo -n "mypassword" | sha512sum | cut -f1 -d" " > secret.hash
hashcat -a 3 -m 1700 --status --status-timer 10 --outfile outfile secret.hash ?l?l?l?l?l?l?l?l?l?l

http-server -c1

curl --upload-file '/home/c/Projects/crack-api/readme.md' ''

curl -v -X PUT -T /home/c/Projects/crack-api/readme.md ""

x=5; y=5; for i in $(seq 1 $x); do hex_string=$(openssl rand -hex $((y/2))); echo -n "$hex_string" | sha512sum | cut -f1 -d" " > "secret-$hex_string.hash"; done


To run project:

Start Instance on aws

cd crack-api

./setup.sh

docker compose up