FROM node:14.16.0-alpine

WORKDIR /usr/src/app

RUN npm i -g azure-functions-core-tools@2 --unsafe-perm true

ENV AzureWebJobsScriptRoot=/usr/src/app \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

CMD ["func", "start", "--javascript"]
