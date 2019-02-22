# Icons

[![Build Status](https://travis-ci.com/helpscout/hs-icons.svg?token=mizbXyxLU95YeKzixKT2&branch=master)](https://travis-ci.com/helpscout/hs-icons)

> Help Scout's Icon font

Built using [gulp](http://gulpjs.com/).

## Table of contents

- [Installation](#installation)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Updating](#updating)

## Installation

```
npm install --save @helpscout/icons
```

## Requirements

- Node
- Gulp

##### Node

If you do not have Node installed on your machine, we recommend installing it using [Homebrew](https://github.com/customerio/mvp#homebrew).

Run the following command in your command line:

```
brew install node
```

##### Gulp

Help Scout's icon font is compiled using Gulp. See the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide for more information.

```
npm install -g gulp
```

## Getting started

##### Installing node things

Similar to Bundler, all you have to do is run the following command, which will allow Gulp to do it's thing.

```
npm install
```

## Updating

Icon font are automatically generated based on the folders and `.svg` files within the `src` directory.

##### Directory naming

The folder's name (e.g. `awesome`) will be used as the name of the icon font, and will appear in `/dist/` once the font is compiled.

##### File naming

`.svg` files that are added/removed from directories within `/src/` will be added/removed from the compiled fonts. The file name of the `.svg` file will be used for the class name of the icon in the compiled CSS.

Example:

```
checkmark.svg -> .icon-checkmark
```

##### Building

To build the icon font, execute the following command in your command line:

```
gulp
```

This will compile the icon font (eot, svg, ttf, woff, woff2) and other files (`.css`, `.scss`, `.html`, `.md`). These files can be found in the `/dist/` directory.
