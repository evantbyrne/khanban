# Via https://docs.docker.com/compose/django/

FROM python:3

ENV KHANBAN_ENV local

ENV PYTHONUNBUFFERED 1

RUN mkdir /code

WORKDIR /code

ADD requirements.txt /code/

RUN pip install -r requirements.txt

ADD . /code/
