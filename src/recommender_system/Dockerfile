FROM python:3.9-slim as base

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y gcc curl

COPY ./requirements.txt requirements.txt

RUN pip3 install -U setuptools
RUN pip3 install -r ./requirements.txt

COPY ./app/ .

RUN chmod +x /usr/src/app/run_server.sh
RUN chmod +x /usr/src/app/run_trainer.sh

FROM base as development
ENTRYPOINT [ "sh", "/usr/src/app/run_server.sh" ]

FROM base as demo
ENTRYPOINT [ "sh", "/usr/src/app/run_server.sh", "DEMO" ]

# Production branch of a Dockerfile
# It's currently the same as development branch above but it's here for future use
FROM base as production
ENTRYPOINT [ "sh", "/usr/src/app/run_server.sh", "PRODUCTION" ]