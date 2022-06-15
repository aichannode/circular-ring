[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Requirements

## Git-flow

This repository use the git flow standard and requires the installation of a git plugin. Refer to the [official installation guide](https://github.com/nvie/gitflow/wiki/Installation) depending on your OS.

## Node version manager

This repository is dependent of NodeJS 16. You could use [NVM](https://github.com/nvm-sh/nvm) or [N](https://www.npmjs.com/package/n) to set node version.

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

## Building/Testing

### iOS

In Xcode, select the correct target, Circular-prod, Circular-dev or Circular-demo. This action will select the correct env.

#### Test Flight

To build (archive) a TF (Test Flight) you need an App Distribution Certificate, on [Apple Developer](https://developer.apple.com/account/resources/certificates/list) and a [profile](https://developer.apple.com/account/resources/profiles/list) that accept the certificate.

In Xcode, select the project `Circular` -> Your target (Prod, Dev or Demo) -> `Signing & Capabilities` : Disable the `Automatically manage signing`.
Select your Provisioning profile you've just created and your Signing certificate (App Distribution) associated.

Now we will archive the projet :

Select the project `Circular` -> Your target (Prod, Dev or Demo) -> `Any iOS Device (arm64)` (on top) -> `Product` (in the tab bar) -> `Archive`

Press next until the end of the process which end with the upload.

When uploaded, you will see your build appear on the [App Store Connect interface](https://appstoreconnect.apple.com/apps/1583942047/testflight/ios), don't forget to select your testers. If the testers are external, Apple will review the app.
