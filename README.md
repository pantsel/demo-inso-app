# This is a demo application

## Setup

Clone the repository

```bash
 $ git clone https://github.com/pantsel/demo-inso-app
```

Configure the environment

```bash
 $ ./scripts/prep-act-secrets.sh  
```

## Run the APIOps pipeline

```bash
 $ act -W .github/workflows/promote-api.yaml
```