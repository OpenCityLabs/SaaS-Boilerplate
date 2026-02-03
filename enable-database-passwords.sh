#!/bin/bash
# Script to enable password authentication on FalkorDB and Redis in GKE

set -e

echo "🔐 Enabling Password Authentication for FalkorDB and Redis"
echo "==========================================================="

# Get passwords from Google Cloud Secrets
FALKORDB_PASSWORD=$(gcloud secrets versions access latest --secret="falkordb-password")
REDIS_PASSWORD=$(gcloud secrets versions access latest --secret="redis-password")

echo "✅ Retrieved passwords from Google Cloud Secrets"

# Connect to GKE cluster
echo "📡 Connecting to GKE cluster..."
gcloud container clusters get-credentials ocl-cluster --region us-central1

# Create Kubernetes secrets for FalkorDB and Redis
echo "🔑 Creating Kubernetes secrets..."

kubectl create secret generic falkordb-secret \
  --from-literal=falkordb-password="$FALKORDB_PASSWORD" \
  -n data \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic redis-secret \
  --from-literal=redis-password="$REDIS_PASSWORD" \
  -n data \
  --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Kubernetes secrets created"

# Update FalkorDB ConfigMap to enable password authentication
echo "📝 Updating FalkorDB configuration..."

kubectl get configmap falkordb-config -n data -o yaml > /tmp/falkordb-config.yaml 2>/dev/null || cat > /tmp/falkordb-config.yaml <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: falkordb-config
  namespace: data
data:
  redis.conf: |
    requirepass $FALKORDB_PASSWORD
    bind 0.0.0.0
    protected-mode yes
    port 6379
    tcp-backlog 511
    timeout 0
    tcp-keepalive 300
EOF

kubectl apply -f /tmp/falkordb-config.yaml

# Update Redis ConfigMap
echo "📝 Updating Redis configuration..."

kubectl get configmap redis-config -n data -o yaml > /tmp/redis-config.yaml 2>/dev/null || cat > /tmp/redis-config.yaml <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
  namespace: data
data:
  redis.conf: |
    requirepass $REDIS_PASSWORD
    bind 0.0.0.0
    protected-mode yes
    port 6379
    tcp-backlog 511
    timeout 0
    tcp-keepalive 300
EOF

kubectl apply -f /tmp/redis-config.yaml

# Restart FalkorDB and Redis pods to apply new configuration
echo "🔄 Restarting FalkorDB pod..."
kubectl rollout restart deployment/falkordb -n data 2>/dev/null || \
kubectl rollout restart statefulset/falkordb -n data 2>/dev/null || \
echo "⚠️  Could not find FalkorDB deployment. You may need to manually restart it."

echo "🔄 Restarting Redis pod..."
kubectl rollout restart deployment/redis -n data 2>/dev/null || \
kubectl rollout restart statefulset/redis -n data 2>/dev/null || \
echo "⚠️  Could not find Redis deployment. You may need to manually restart it."

echo ""
echo "✅ Password authentication configuration complete!"
echo ""
echo "📊 Check status with:"
echo "   kubectl get pods -n data"
echo ""
echo "🧪 Test FalkorDB connection:"
echo "   kubectl exec -it -n data <falkordb-pod> -- redis-cli -a '$FALKORDB_PASSWORD' ping"
echo ""
echo "🧪 Test Redis connection:"
echo "   kubectl exec -it -n data <redis-pod> -- redis-cli -a '$REDIS_PASSWORD' ping"
echo ""
echo "🌐 Your Cloud Run service (alignhealthcare) is already configured to use these passwords!"
echo "   https://alignhealthcare.ai"
