aws --region ap-southeast-2 ecr get-login-password | docker login --username AWS --password-stdin 901444280953.dkr.ecr.ap-southeast-2.amazonaws.com
aws configure export-credentials --profile default | jq -r '.AccessKeyId,.SecretAccessKey,.SessionToken' | xargs -n3 bash -c 'ecs-cli configure profile --profile-name default --access-key $0 --secret-key $1 --session-token $2'
