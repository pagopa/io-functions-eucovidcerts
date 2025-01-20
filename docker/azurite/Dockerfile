FROM node:14.16.0-alpine@sha256:0a6a21d28509f56155007444075ef4fdd36eef0a97924623cb641d3766e3b8d3 as builder

WORKDIR /opt/azurite

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN git clone https://github.com/Azure/Azurite /opt/azurite && \
    git checkout legacy-master

RUN npm install

FROM node:14.16.0-alpine@sha256:0a6a21d28509f56155007444075ef4fdd36eef0a97924623cb641d3766e3b8d3

COPY --from=builder /opt/azurite /opt/azurite

WORKDIR /opt/azurite

VOLUME /opt/azurite/folder

ENV executable azurite

CMD ["sh", "-c", "node bin/${executable} -l /opt/azurite/folder"]
