# 3tier-sample-todo-app

To create the secrets

```shell
$ kubectl create secret generic mysql-sec --from-literal username=admin --from-literal password='{password}' --from-literal port=3306 --from-literal dbname=todo_db --from-literal host={rds mysql hostname}
```

To install aws loadbalancer controller
Please install eksctl and helm for the below commands 

```shell
eksctl utils associate-iam-oidc-provider --region=us-east-2 --cluster=sre-project-one-eks --approve
```
```shell
eksctl create iamserviceaccount --cluster=sre-project-one-eks --namespace=kube-system --name=aws-load-balancer-controller --role-name AmazonEKSLoadBalancerControllerRole --attach-policy-arn=arn:aws:iam::{aws_account_ID}:policy/AWSLoadBalancerControllerIAMPolicy --approve --region=us-east-2
```

```shell
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=sre-project-one-eks --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller --set region=us-east-2 --set vpcId={vpcId}
```

After you create these run the below to deploy your application in default namespace

```shell
kubectl apply -f k8s-files/frontend/
kubectl apply -f k8s-files/backend/
kubectl apply -f k8s-files/ingress.yaml
```
