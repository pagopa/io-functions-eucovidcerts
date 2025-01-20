FROM node:14.16.0-alpine@sha256:0a6a21d28509f56155007444075ef4fdd36eef0a97924623cb641d3766e3b8d3

WORKDIR /opt/cosmosdb

RUN npm install -g @zeit/cosmosdb-server ts-node

CMD ["sh", "-c", "cosmosdb-server -p 3000"]
