# Railway PR Delete Action

Fork of [Railway PR Delete Action](https://github.com/Faolain/railway-pr-delete) converted to TypeScript, updated Node runtime and with some improvements.

## Inputs

| Name              | Required | Default | Description                                                                                                                    |
| ----------------- | :------: | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| RAILWAY_API_TOKEN |   [x]    |         | Railway Token. See: https://railway.app/account/tokens                                                                         |
| PROJECT_ID        |   [x]    |         | The id of the project to create environments on. Can be found on Settings -> General page                                      |
| DEST_ENV_NAME     |   [x]    |         | The name of the deployed PR environment. Usually a combination of pr-<PR_NUMBER>-<SHORT_COMMIT_HASH> passed inside of workflow |

## How To Use

```yaml
- name: Delete PR environment on Railway
  if: github.event.action == 'closed'
  uses: OtterlySpace/railway-pr-delete@v3
  with:
      RAILWAY_API_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
      DEST_ENV_NAME: pr-${{ github.event.pull_request.number }}
```
