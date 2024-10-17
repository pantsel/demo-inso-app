# This is a demo application

## Setup

Clone the repository

```bash
 $ git clone https://github.com/pantsel/demo-inso-app
```

Configure the environment.

Get a Konnect PAT and paste it in the prompt.

```bash
 $ cp .env.example .env

```bash
 $ ./scripts/prep-act-secrets.sh  
```

## Insomnia

1. Open insomnia
2. Create a new project in the Personal workspace of type Cloud Sync
3. Click git clone and paste the repository `https://github.com/pantsel/demo-inso-app`
4. All the insomnia workspace setting will be imported. Here, we can showcase aroung make any changes we need and commit the changes to the repository (via insomnia).

## Run the APIOps pipeline

```bash
 $ act -W .github/workflows/promote-api.yaml
```