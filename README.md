[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Requirements

## Git-flow

This repository use the git flow standard and requires the installation of a git plugin. Refer to the [official installation guide](https://github.com/nvie/gitflow/wiki/Installation) depending on your OS.

## Commitizen

This repository enforces conventionnal commit messages. You can use any [IDE or git plugin](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen) you want but, as a minimum requirement, you need to configure a git hook to format the message.

First, create the hook

```bash
$ cat > ./git/hooks/prepare-commit-msg << 'END'
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
END
```
It will force the Commitizen prompt to pop when you do: `git commit`

Then, make it executable

```bash
$ chmod 775 .git/hooks/prepare-commit-msg
```