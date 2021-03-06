# Forecasting Stocks and Crypto prices using Redis, Prophet and Grafana

![Finance](https://raw.githubusercontent.com/RedisGrafana/redis-finance-prophet/main/images/finance.png)

[![Grafana 8](https://img.shields.io/badge/Grafana-8-orange)](https://www.grafana.com)
[![Redis Data Source](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Data%20Source&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-datasource)](https://grafana.com/grafana/plugins/redis-datasource)
[![Redis Application plug-in](https://img.shields.io/badge/dynamic/json?color=blue&label=Redis%20Application%20plug-in&query=%24.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins%2Fredis-app)](https://grafana.com/grafana/plugins/redis-app)

## Introduction

This project demonstrates how to analyze Stocks and Crypto historical data stored as [RedisTimeSeries](https://oss.redislabs.com/redistimeseries/) using serverless engine [RedisGears](https://oss.redislabs.com/redisgears/), [Facebook’s Prophet Model](https://facebook.github.io/prophet/) to predict prices and [Redis Data Source](https://github.com/RedisGrafana/grafana-redis-datasource) to visualize time series with predictions in Grafana.

![Redis-Prophet](https://raw.githubusercontent.com/RedisGrafana/redis-finance-prophet/main/images/redis-prophet.png)


## Requirements

- [Docker](https://docker.com) to start Redis and Grafana.
- [Node.js](https://nodejs.org) to run scripts.

## Redis with Prophet Docker image

This project provides Docker image with Redis, RedisTimeSeries, RedisGears and installed Prophet libraries.

```bash
docker run -p 6379:6379 --name=redis-prophet ghcr.io/redisgrafana/redis-prophet:latest
```

To start Redis-Prophet and Grafana using Docker Composer run:

```bash
docker-compose pull
docker-compose up
```
You can see all the dashboards on Grafana on ``` http://localhost:3000/ ```
## Prophet requirements

Check that Prophet downloaded and installed in the RedisGears requirements, run this command in the Redis-Cli tool:

```bash
RG.PYDUMPREQS
1)  1) "GearReqVersion"
    2) (integer) 1
    3) "Name"
    4) "prophet"
    5) "IsDownloaded"
    6) "yes"
    7) "IsInstalled"
    8) "yes"
    9) "CompiledOs"
   10) "linux-buster-x64"
   11) "Wheels"
   12)  1) "pytz-2021.1-py2.py3-none-any.whl"
        2) "numpy-1.20.2-cp37-cp37m-manylinux2010_x86_64.whl"
        3) "hijri_converter-2.1.1-py3-none-any.whl"
        4) "kiwisolver-1.3.1-cp37-cp37m-manylinux1_x86_64.whl"
        5) "convertdate-2.3.2-py3-none-any.whl"
        6) "six-1.15.0-py2.py3-none-any.whl"
        7) "Pillow-8.2.0-cp37-cp37m-manylinux1_x86_64.whl"
        8) "tqdm-4.60.0-py2.py3-none-any.whl"
        9) "korean_lunar_calendar-0.2.1-py3-none-any.whl"
       10) "cycler-0.10.0-py2.py3-none-any.whl"
       11) "python_dateutil-2.8.1-py2.py3-none-any.whl"
       12) "holidays-0.11.1-py3-none-any.whl"
       13) "PyMeeus-0.5.11-py3-none-any.whl"
       14) "ephem-3.7.7.1-cp37-cp37m-manylinux2010_x86_64.whl"
       15) "ujson-4.0.2-cp37-cp37m-manylinux1_x86_64.whl"
       16) "pyparsing-2.4.7-py2.py3-none-any.whl"
       17) "prophet-1.0.1-py3-none-any.whl"
       18) "matplotlib-3.4.1-cp37-cp37m-manylinux1_x86_64.whl"
       19) "Cython-0.29.22-cp37-cp37m-manylinux1_x86_64.whl"
       20) "pystan-2.19.1.1-cp37-cp37m-manylinux1_x86_64.whl"
       21) "setuptools_git-1.2-py2.py3-none-any.whl"
       22) "cmdstanpy-0.9.68-py3-none-any.whl"
       23) "LunarCalendar-0.0.9-py2.py3-none-any.whl"
       24) "pandas-1.2.3-cp37-cp37m-manylinux1_x86_64.whl"
```

## Import data

Import script will load data from CSV files in `/import` folder to RedisTimeSeries.

```bash
npm run import
```

To create forecast run RedisGears function and display results on the Grafana dashboards. The process will take several minutes .

## Forecast 365, 90, 30 and 7 days

```bash
redis-cli RG.PYEXECUTE "`cat ./gears/predict365.py`" REQUIREMENTS prophet
redis-cli RG.PYEXECUTE "`cat ./gears/predict90.py`" REQUIREMENTS prophet
redis-cli RG.PYEXECUTE "`cat ./gears/predict30.py`" REQUIREMENTS prophet
redis-cli RG.PYEXECUTE "`cat ./gears/predict7.py`" REQUIREMENTS prophet
```

Using `npm`

```bash
npm run predict:365
npm run predict:90
npm run predict:30
npm run predict:7
```

Script output

```
> Executing task in folder redis-finance-prophet: yarn run predict:7 <

yarn run v1.22.10
$ redis-cli RG.PYEXECUTE "`cat ./gears/predict7.py`" REQUIREMENTS prophet
1) 1) "{'event': None, 'key': '{BTC-USD:CLOSE}', 'type': 'module', 'value': None}"
   2) "{'event': None, 'key': '{ADA-USD:CLOSE}', 'type': 'module', 'value': None}"
   3) "{'event': None, 'key': '{ETH-USD:CLOSE}', 'type': 'module', 'value': None}"
   4) "{'event': None, 'key': '{AAPL:CLOSE}', 'type': 'module', 'value': None}"
   5) "{'event': None, 'key': '{MATIC-USD:CLOSE}', 'type': 'module', 'value': None}"
   6) "{'event': None, 'key': '{PTON:CLOSE}', 'type': 'module', 'value': None}"
   7) "{'event': None, 'key': '{TSLA:CLOSE}', 'type': 'module', 'value': None}"
   8) "{'event': None, 'key': '{DOGE-USD:CLOSE}', 'type': 'module', 'value': None}"
2) (empty array)
✨  Done in 88.01s.
```

## Start Grafana

Grafana can be started using Docker Compose or installed locally with [Redis plug-ins for Grafana](https://redisgrafana.github.io).

```bash
docker-compose pull
docker-compose up
```

When starting using Docker Compose, dashboard and plug-ins will be auto-provisioned and available in Grafana.

## Learn more

- Redis plug-ins for Grafana [Documentation](https://redisgrafana.github.io/)
- [Forecasting Stock Prices using Prophet](https://towardsdatascience.com/forecasting-stock-prices-using-prophet-652b31fb564e)
- [Time-Series Forecasting: Predicting Stock Prices Using Facebook’s Prophet Model](https://towardsdatascience.com/time-series-forecasting-predicting-stock-prices-using-facebooks-prophet-model-9ee1657132b5)
