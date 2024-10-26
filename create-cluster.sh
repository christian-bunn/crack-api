ecs-cli up \
    --instance-role 'Execution-Role-CAB432-ECS' \
    --tags 'qut-username=n11092505@qut.edu.au,purpose=assessment3' \
    --vpc 'vpc-007bab53289655834' \
    --subnets 'subnet-05a3b8177138c8b14' \
    --launch-type 'FARGATE'