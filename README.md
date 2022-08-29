# Backbone SDK

Backbone SDK is an all-in-one development tool for Backbone apps.

After you've installed the SDK, you are able to use `bb` or `backbone` commands to work with the SDK.

## Installing via setup script

```bash
# clone the repo (NPM package not yet available)
git clone https://github.com/backbonedao/sdk.git

# run setup
npm run setup
```

## Installing manually

If the setup script fails for some reason, here are the steps to install manually.

```bash
# clone the repo (NPM package not yet available)
git clone https://github.com/backbonedao/sdk.git

# init git submodules to clone Core
git submodule init && git submodule update
# if submodule update fails, clone https://github.com/backbonedao/core.git to lib/core manually

# install Core dependencies
cd lib/core
npx pnpm i

# build Core
npm run build:node

# build SDK
cd ../..
npm run build

# install bb command
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

# start development server
> bb dev

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