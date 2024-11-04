cd cracker
ecs-cli compose \
    --project-name 'cracker' \
    --ecs-params 'ecs-params.yml' \
    create \
    --tags 'qut-username=n11092505@qut.edu.au,purpose=assessment3' \
    --launch-type FARGATE
cd -

cd frontend
ecs-cli compose \
    --project-name 'frontend' \
    --ecs-params 'ecs-params.yml' \
    service up \
    --tags 'qut-username=n11092505@qut.edu.au,purpose=assessment3' \
    --launch-type FARGATE \
    --enable-service-discovery
cd -

cd backend
ecs-cli compose \
    --project-name 'backend' \
    --ecs-params 'ecs-params.yml' \
    service up \
    --tags 'qut-username=n11092505@qut.edu.au,purpose=assessment3' \
    --launch-type FARGATE \
    --enable-service-discovery
cd -