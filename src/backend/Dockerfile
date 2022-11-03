FROM python:3.9-slim

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install -y gcc

COPY ./requirements.txt requirements.txt

RUN pip3 install -U setuptools 
RUN pip3 install -r ./requirements.txt

COPY ./core/ .
# COPY ./entrypoint.sh .

RUN chmod +x /usr/src/app/entrypoint.sh
# this is honestly massive **** but there's no other way how to do it...
# django-graphene package is not compatible with django 4.0 and since django 4.0 ang graphql-core deprecated the use of format_error function 
# this has to be done...
# the following code replaces import of format_error from graphql.error with import of GraphQLFormattedError in graphql-graphene views
# otherwise grapql views cannot be imported
# RUN sed -i "/from graphql.error import format_error as format_graphql_error/c\from graphql.error import GraphQLFormattedError as format_graphql_error" /usr/local/lib/python3.9/site-packages/graphene_django/views.py
ENTRYPOINT [ "sh", "/usr/src/app/entrypoint.sh" ]
# ENTRYPOINT ["tail", "-f", "/dev/null"]