ecs-cli compose \
    --ecs-params 'ecs-params.yml' \
    up \
    --tags 'qut-username=n11092505@qut.edu.au,purpose=assessment3' \
    --launch-type FARGATE \
    --force-update