FROM docker.elastic.co/elasticsearch/elasticsearch:7.8.0 as elastic-linux-amd64
# amd image
FROM docker.elastic.co/elasticsearch/elasticsearch:7.8.0-arm64 as elastic-linux-arm64
# arm image

RUN echo "TARGETOS=${TARGETOS} TARGETARCH=${TARGETARCH} TARGETVARIANT=${TARGETVARIANT}"
FROM elastic-${TARGETOS}-${TARGETARCH}${TARGETVARIANT}
# main
WORKDIR /usr/share/elasticsearch
COPY ./hunspell /usr/share/elasticsearch/config/hunspell/