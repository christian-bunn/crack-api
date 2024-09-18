// note: uses hashcat to crack the password for a given file

// crack (encrypted_file_id, wordlist_file_id) returns (output)
// api to crack a file using the following command
// hashcat -m 22000 -a 0 hashcat.hccapx rockyou.txt
// the user will provide the file ids for the wordlist and encrypted file
// the server will download the files from s3
// the server will run the command
// the server will return the output