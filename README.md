[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Requirements

## Commitizen
This repository enforces conventionnal commit messages. You can use any [IDE or git plugin](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen) you want but, as a minimum requirement, you need to configure a git hook to format the message.

First, create the hook

```bash
$ cat > some.text << 'END'
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
END
```

Then, make it executable

```bash
$ chmod ug+x .git/hooks/prepare-commit-msg
```
