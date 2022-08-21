# Backbone SDK

Backbone SDK is an all-in-one development tool for Backbone apps.

After you've installed the SDK, you are able to use `bb` or `backbone` commands to work with the SDK.

## Installing

```bash
# clone the repo (NPM package not yet available)
git clone https://github.com/backbonedao/sdk.git

# create a symlink from `lib/core` to `../core`
mklink /J lib\core ..\core # Windows (use command prompt in admin mode)
ln -s ../core lib/core # Linux & macOS

# install dependencies
npx pnpm i

# build the SDK
npm run build

# install bb command (note: fails on Windows - https://github.com/backbonedao/sdk/issues/3)
npm link
```

## Usage

**With `npm link`:**
```bash
# get all workflows
> bb help

# get options on specific workflow
> bb help [workflow]

# scaffolds a new Backbone app project in an empty directory
> bb init

# compile app and user interface into minimized bundles
> bb compile

# creates a release checksum for developer to sign
> bb release

# deploys app release into container
> bb deploy

# distributes app code and hosts data to other app users
> bb serve
```

**Without `npm link`:**
```bash
# instead of bb, use node [sdk directory]/dist
> node ./dist init
```