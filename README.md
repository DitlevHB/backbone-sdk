# Backbone SDK

Backbone SDK is an all-in-one development tool for Backbone apps.

After you've installed the SDK, you are able to use `bb` or `backbone` commands to work with the SDK.

## Installing

```bash
# clone the repo (NPM package not yet available)
git clone https://github.com/backbonedao/sdk.git

# run setup
npm run setup
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