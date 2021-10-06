#!/bin/bash
environment=(dev demo prod)

usage() {
    echo "Usage: npm run set-env [env]"
    echo "Environments: ${environment[@]}"
}

if [ "$#" -ne 1 ]; then
    usage
    exit 1
fi

setEnv() {
if [[ " ${environment[@]} " =~ " $1 " ]]; then
    echo "Set up $1 environment"
    (
        set -x;
        cp .env.$1 .env;
    )
    echo -e "\033[0;32mEnvironment $1 successfully setup\033[0m"
else
    usage
    exit 1
fi
}

setEnv $1;
