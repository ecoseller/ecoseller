---
title: Intro
category: Programming documentation
order: 1
---

# Technical design
In this section we will briefly introduce technologies that are used to build our application.
## Backend
We can divide the backend part into several subsections based on the area it handles.
### Core Application
Core part of the application will be implemented in Python using the following technologies:
* `Django Rest Framework` – open source Python web framework
* `Redis` – open source data store that will help us with server-side caching and back-end task queuing
* `Elasticsearch` – search and analytic engine

## Recommender System
The recommender system will be implemented in Python, the following tech- nologies will be used as well:
* `Flask` – open source Python web framework
* `NumPy` – open source Python library used to work with vectors and matrices
* `TensorFlow` – open source Python library used for machine learning

## Database
For storing all product, order and customer data, we will be using `PostreSQL` relational database

## Front-end
Front-end part will be implemented with Next.js – open source `React` framework combined with `TypeScript`.

## Deployment
For easier, more flexible and scalable deployment, we will use `Docker` for containerization of our entire system.

## Version control
As a version control system, we decided to go with the current state-of-the- art `git`. More specifically, as our hosting platform, we chose `GitHub`.

## Coding style
We use several tools for enforcing our code style. In both the dashboard and the storefront, we use:
* `Prettier` – an opinionated code formatter with support for many languages, including `JavaScript` and `TypeScript`
* `ESLint` – a static analysis tool identifying problematic patterns found in `JavaScript` and `TypeScript` code
  
Similarly, in `Core` component (which is written in `Python`) we use `black` code formatter and `flake8` linter.
This way, we ensure consistent formatting of our code and avoid common bugs, which can be found by static analysis tools. We further use these tools in our Continuous integration setup, as described in [Contribution - Continuous integration](../../contribution#continuous-integration) section.

# Architecture
describe architecture (probably using C4 diagrams)

# Links