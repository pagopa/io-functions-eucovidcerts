# IO Functions template

Template per l'utilizzo di Azure Functions (e Durable Functions) all'interno del
progetto IO.

Una volta clonato il repo assicurarsi di:

- editare i metadati del repository nel file `package.json`

- specificare un nome per il
  [TaskHub](https://docs.microsoft.com/it-it/azure/azure-functions/durable/durable-functions-task-hubs)
  in host.json in modo da evitare di condividere lo stesso per function diverse
  che usano lo stesso storage

- effettuare il [tuning dei parametri per le durable
  function](https://docs.microsoft.com/it-it/azure/azure-functions/durable/durable-functions-bindings#host-json)

- impostare a `false` il parametro `FUNCTIONS_V2_COMPATIBILITY_MODE` nel file
  `local.settings.json` nel caso di upgrade a `azure-functions@3.x`

- modificare l' endpoint di healthcheck all' interno del file `deploy-pipelines.yml` in base al `basePath` configurato.

- fare una PR sul progetto [gitops](https://github.com/pagopa/gitops) per deployare le pipelines. (un esempio [qui](https://github.com/pagopa/gitops/pull/11) )

- fare una PR sul progetto [io-infrastructure-live-new](https://github.com/pagopa/io-infrastructure-live-new) per fare il stetup degli ambienti di prod e staging della nuova function. (un esempio [qui](https://github.com/pagopa/io-infrastructure-live-new/pull/465) )

## Sviluppo in locale con Docker

```shell
cp env.example .env
yarn install
yarn build
docker-compose up -d --build
docker-compose logs -f functions
open http://localhost/some/path/test
```
## Sviluppo in locale con Docker

```shell
cp env.example .env
yarn install
yarn build
docker-compose up -d --build
docker-compose logs -f functions
open http://localhost/some/path/test
```

## Deploy

Il deploy avviene tramite una [pipeline](./.devops/deploy-pipelines.yml)
(workflow) configurata su [Azure DevOps](https://dev.azure.com/pagopa-io/).

## Esempi di function

Sono presenti alcune function di esempio che permettono di testare la corretta
esecuzione del runtime delle durable functions. Le funzioni attivate 
da [trigger HTTP](./HttpTriggerFunction) utilizzano il pacchetto
[io-functions-express](https://github.com/teamdigitale/io-functions-express).
