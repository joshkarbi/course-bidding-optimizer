## Angular client
Deployed on GCP using Cloud Run

To deploy (replace PROJECT-ID, SERVICE-NAME, and PROJECT-NAME)
```
gcloud builds submit --tag gcr.io/PROJECT-ID/SERVICE-NAME
gcloud run deploy --image gcr.io/PROJECT-ID/SERVICE-NAME --platform managed

```