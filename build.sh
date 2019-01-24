#!/bin/bash

C=`pwd`

function check() {
 if [[ $? -ne 0 ]]; then echo "failed."; exit 1; fi
}


yarn --cwd ./packages/core run init && yarn --cwd ./packages/core run build && yarn --cwd ./packages/core run republish-local
check

mvn clean install -f packages/ts-exporter/pom.xml
check
[ -e kiegroup-all ] || git clone https://github.com/tiagobento/kiegroup-all
check

cd kiegroup-all
check

git submodule init
check

git submodule update --remote
check

git submodule foreach "pwd | xargs basename | xargs -I{} git remote add fork git@github.com:tiagobento/{}.git || echo 'Ignore'"
check

git submodule foreach "git checkout $1/$2 || echo 'a'"
check

git submodule foreach "git pull -r $1 $2 || echo 'b'"
check

mvn clean install -Denforcer.skip -DskipTests -Dgwt.compiler.skip -Dgwt.skipCompilation -Pts-exporter-build,\!notProductizedProfile
check

cd ..
check

yarn --cwd ./packages/workbench-screens run init && yarn --cwd ./packages/workbench-screens run build
check

cd ${C}
check