FROM node:14.16.0-alpine@sha256:0a6a21d28509f56155007444075ef4fdd36eef0a97924623cb641d3766e3b8d3

WORKDIR /usr/src/app

RUN npm i -g azure-functions-core-tools@2 --unsafe-perm true

ENV AzureWebJobsScriptRoot=/usr/src/app \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

CMD ["func", "start", "--javascript"]
