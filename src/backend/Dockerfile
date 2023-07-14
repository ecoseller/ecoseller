FROM python:3.9-slim as base

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y gcc

COPY ./requirements.txt requirements.txt

RUN pip3 install -U setuptools 
RUN pip3 install -r ./requirements.txt

COPY ./core/ .

FROM base as development
RUN chmod +x /usr/src/app/data_preparation.sh
RUN chmod +x  /usr/src/app/entrypoint_dev.sh
ENTRYPOINT [ "sh", "-c", "/usr/src/app/data_preparation.sh && /usr/src/app/entrypoint_dev.sh" ]

FROM base as demo
RUN apt-get install -y git postgresql-client
RUN pip3 install gunicorn==20.1.0
RUN chmod +x /usr/src/app/demo_data_loader.sh
RUN chmod +x /usr/src/app/data_preparation.sh
RUN chmod +x /usr/src/app/entrypoint_prod.sh
ENTRYPOINT [ "sh", "-c", "/usr/src/app/demo_data_loader.sh && /usr/src/app/data_preparation.sh && /usr/src/app/entrypoint_prod.sh" ]

# Production branch of a Dockerfile
FROM base as production
RUN pip3 install gunicorn==20.1.0
RUN chmod +x /usr/src/app/data_preparation.sh
RUN chmod +x /usr/src/app/entrypoint_prod.sh
ENTRYPOINT [ "sh", "-c", "/usr/src/app/data_preparation.sh && /usr/src/app/entrypoint_prod.sh" ]

FROM base as rq-worker
RUN chmod +x /usr/src/app/rq_worker.sh
ENTRYPOINT [ "sh", "-c", "/usr/src/app/rq_worker.sh" ]