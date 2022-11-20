# Continuous integration

We use [Github actions](https://docs.github.com/en/actions) for CI.  
There are multiple jobs set up (1 for each project component + action for docker compose), which automatically run on every commit to `master` branch
and pull request update.

## What to do if CI jobs fail
See the error in Github Action detail.

If it's a linter/formatter error, see the README file of corresponding component.
- [backend](../src/backend/README.md)
- [dashboard](../src/dashboard/README.md)
- [storefront](../src/storefront/README.md)
- [HTTP library](../src/http-library/README.md)

Follow the instructions for linting / formatting.

After everything works locally, commit and push the changes, CI jobs will start automatically.
