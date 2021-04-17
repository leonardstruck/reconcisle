<p align="center"><img src="src/app/assets/icon/icon.ico" width="250" height="250"></p>

# reconcIsle

reconcIsle is an electron app to easily build reconciliation services from your own data sources.

**This app is not yet ready for production. If there are any bugs, I would be very happy if you would create an issue.**

## Installation

Recommended is the installation via one of the provided [releases](https://reconcisle.leonardstruck.com/).

## Usage

Add one of your sources via the interface. Once the setup is complete, you will see your created service in the project overview.
Then, you need to add reconcIsle as a reconciliation service to OpenRefine. To do this, enter this address (when using the standard port configuration): http://localhost:1234/reconcile/ when asked for the URL.

Refer to the public documentation when setting up a reconciliation service: [OpenRefine Documentation](https://docs.openrefine.org/manual/reconciling/)

It gives a comprehensive insight into the topic of reconciliation as well as other information that is essential when using OpenRefine.

## Supported Sources

- Relational Databases:
  - MySQL\*

\* supports data refreshing

## Roadmap

I'm planning on adding the following sources as well:

- Relational Databases:
  - PostgreSQL
  - MariaDB
  - SQLite
  - Microsoft SQL Server
- Excel Spreadsheets
- CSV

These are the features I want to add:

- import project files
- custom queries
