# Backbone SDK

Backbone SDK is an all-in-one development tool for Backbone apps.

After you've installed the SDK, you are able to use `bb` or `backbone` commands to work with the SDK.

## Installing

1. Clone the repo (NPM package not yet available)
2. Clone Core repo preferably to `../core` path
3. Create a symlink from `lib/core` to `../core`
  - Windows: `mklink /J lib\core ..\core` (use command prompt in admin mode)
  - Linux & macOS: `ln -s ../core lib/core`
4. Run `npx pnpm i` to install dependencies
5. Run `npm run build` to build SDK
6. Run `npm link` to install `bb` (note: [fails on Windows](https://github.com/backbonedao/sdk/issues/3))

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