# 3tier-sample-todo-app

```shell
$ kubectl create secret generic mysql-sec --from-literal username=admin --from-literal password='{password}' --from-literal port=3306 --from-literal dbname=todo_db --from-literal host={rds mysql hostname}
```
