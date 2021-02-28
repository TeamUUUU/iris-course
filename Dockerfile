ARG IMAGE=intersystemsdc/iris-community:2020.4.0.524.0-zpm
FROM $IMAGE

USER root

WORKDIR /opt/irisapp

RUN chown ${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} /opt/irisapp

USER ${ISC_PACKAGE_MGRUSER}

COPY  Installer.cls .
COPY  src src

RUN                                                            \
  iris start ${ISC_PACKAGE_INSTANCENAME} &&                    \
  /bin/echo -e ""                                              \
    " do ##class(%SYSTEM.Process).CurrentDirectory(\"$PWD\")"  \
    " do ##class(%SYSTEM.OBJ).Load(\"Installer.cls\", \"ck\")" \
    " do ##class(App.Installer).setup()"                       \
    " halt"                                                    \
  | iris session ${ISC_PACKAGE_INSTANCENAME} -U %SYS  &&       \
  iris stop ${ISC_PACKAGE_INSTANCENAME} quietly

