FROM python:3.9-slim as base

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y gcc curl

COPY ./requirements.txt requirements.txt

RUN pip3 install -U setuptools
RUN pip3 install -r ./requirements.txt

COPY ./app/ .

ARG IMPORT_DATA="FALSE"

FROM base as development
RUN chmod +x /usr/src/app/run_server.sh
RUN chmod +x /usr/src/app/run_trainer.sh
CMD [ "sh", "/usr/src/app/run_server.sh" ]

FROM base as demo
ARG IMPORT_DATA="TRUE"
RUN chmod +x /usr/src/app/run_server.sh
RUN chmod +x /usr/src/app/run_trainer.sh
CMD [ "sh", "/usr/src/app/run_server.sh" ]

# Production branch of a Dockerfile
# It's currently the same as development branch above but it's here for future use
FROM base as production
RUN chmod +x /usr/src/app/run_server.sh
RUN chmod +x /usr/src/app/run_trainer.sh
CMD [ "sh", "/usr/src/app/run_server.sh" ]