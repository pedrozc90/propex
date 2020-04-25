# propex

projeto de extensão

## Documentation

+ [References](https://github.com/PedroZC90/propex/blob/master/docs/references): arquivos de referência sobre o projeto e o modelo do banco de dados criado pelo grupo anterior.
+ [Scripts](https://github.com/PedroZC90/propex/blob/master/docs/scripts): SQL scripts utilizados para gerar e popular inicialmente o banco de dados.
+ [Models](https://github.com/PedroZC90/propex/blob/master/docs/models): Entity Relationship Diagram (ERD) e modelo do MySQL Workbench.

## Requirements

+ Nodejs 12.16.x
+ NPM 6.13.x
+ MySQL 8.0
    - Create a database named **propex**.

## Run As Development

```bash
# install packages
npm install

# start project on development mode
npm run start
```

## Open MySQL Console

```bash
# open docker container console
docker exec -it mysql /bin/bash

# open mysql console
docker exec -it mysql mysql --user=root --password=wuyqwISlr2PxJUxu
```

## Utility

### Windows

```bash
# find a process running on a port
netstat -ano | findstr :9000

# kill a process
taskkill /pid <pid_number> /f
```

### Linux

```bash
# find a process running on a port
ps aux | grep :9000

# kill a process
kill -9 <pid_number>
```


## License

Please, see [LINCESE](https://github.com/PedroZC90/propex/blob/master/LICENSE) file.
