# Ecoseller backend
This folder contains Ecoseller backend app, written in [Django REST Framework](https://www.django-rest-framework.org/).

### `black`
We're using [black](https://black.readthedocs.io/en/stable/) code formatter.  

Run 
```shell
black ./core
```
to format source files (you need to have virtual env activated).

### `flake8`
We're using [flake8](https://flake8.pycqa.org/en/latest/) linter.

Run
```shell
flake8 ./core
```
to check for errors and warnings. If there are any errors, you need to fix them manually.
