FROM python:3.9-slim as base

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y gcc

COPY ./requirements.txt requirements.txt

RUN pip3 install -U setuptools 
RUN pip3 install -r ./requirements.txt

COPY ./core/ .
# COPY ./entrypoint.sh .

FROM base as development
RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "sh", "/usr/src/app/entrypoint.sh" ]

FROM base as demo
RUN apt-get install -y git postgresql-client
RUN git clone https://github.com/ecoseller/demo-data.git
RUN mv ./demo-data/ /usr/src/demo-data
RUN mv /usr/src/demo-data/media /usr/src/mediafiles
RUN chmod +x /usr/src/app/entrypoint.sh
# load demo data
ENTRYPOINT [ "sh", "-c", "/usr/src/app/entrypoint_demo.sh & /usr/src/app/entrypoint.sh" ]

# Production branch of a Dockerfile
# It's currently the same as development branch above but it's here for future use
FROM base as production
RUN chmod +x /usr/src/app/entrypoint.sh
ENTRYPOINT [ "sh", "/usr/src/app/entrypoint.sh" ]