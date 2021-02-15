# BMSTU-template

А Simple Intersystems IRIS Template for BMSTU classes 2021


The template goes also with a few files which let you immedietly compile your ObjecScript files in InterSystems IRIS Community Edition in a docker container


## Prerequisites
This needs to have git and docker installed.

## Installation 

Clone/git pull the repo into any local directory

```
$ git clone https://github.com/your-repository.git
```

Open the terminal in this directory and run:

```
$ docker-compose build
```

3. Run the IRIS container with your project:

```
$ docker-compose up -d
```

## How to Test it

Open IRIS terminal:

```
$ docker-compose exec iris iris session iris
USER>zn "IRISAPP"
IRISAPP>write ##class(Simple.Demo).Hello()
```

Open http://localhost:9098/bmstuapi/test to test REST API

## How to start coding
This repository is ready to code in VSCode with ObjectScript plugin.
Install [VSCode](https://code.visualstudio.com/) and [ObjectScript](https://marketplace.visualstudio.com/items?itemName=intersystems-community.vscode-objectscript and https://marketplace.visualstudio.com/items?itemName=intersystems-community.servermanager) plugins and open the folder in VSCode.
Open /src/cls/Simple/Demo.cls class and try to make changes - it will be compiled in running IRIS docker container.

Feel free to delete Simple folder and place your ObjectScript classes 

The script in Installer.cls will import everything you place under /src/cls into IRIS.

## What's insde the repo

# Dockerfile

The simplest dockerfile which starts IRIS and imports Installer.cls and then runs the Installer.setup method, which creates IRISAPP Namespace and imports ObjectScript code from /src folder into it.
Use the related docker-compose.yml to easily setup additional parametes like port number and where you map keys and host folders.
Use .env/ file to adjust the dockerfile being used in docker-compose.

# .vscode/settings.json

Settings file to let you immedietly code in VSCode with [VSCode ObjectScript plugin]

# .vscode/launch.json
Config file if you want to debug with VSCode ObjectScript
