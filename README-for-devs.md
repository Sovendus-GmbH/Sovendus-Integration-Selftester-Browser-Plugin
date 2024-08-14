# Integration Tester Browser Extension

This project is a Chrome and Firefox browser extension designed for testing the integration of Sovendus Voucher Network and Checkout Benefits. The extension provides an overlay for validating configurations and integration setups within the browser environment.

## Table of Contents

- [Installation](#installation)
- [Development](#development)
  - [Building the Extension](#building-the-extension)
  - [Running Tests](#running-tests)
- [Release](#release)
  - [Building for Release](#building-for-release)
  - [Release to the extension store](#release-to-the-extension-store)
- [Author](#author)

## Installation

To install the necessary dependencies for this project, run the following command:

```bash
npm install
```

This will install all required dependencies listed in the devDependencies section of the package.json.

## Development

### Building the Extension

To build the extension for both Chrome and Firefox during development, you can use the following command:

```bash
npm run build
```

### Install test builds

#### Chrome or Chromium based Browsers

1. In Chrome got to the extensions page and enable Developer mode
2. Click on Load unpacked and select the build/chrome directory

#### Firefox

1. Run the following command to build a test package
   ```bash
   npm run zip-builds-for-tests
   ```
2. In Firefox got to the extensions page, click on the settings gear -> debug extensions -> Load Temporary Add-on
3. Select the Firefox build in the test_zips directory
4. If you want to rebuild the extension, you must first remove the extension from firefox, as the zip file will be locked

### Running Tests

The project uses Jest and selenium for testing.

Make sure you have Firefox Developer Edition installed, if you get an error that the Firefox binary can not be found, you can override the path in .env, just copy the .env-example and adjust the path.

You can run the test suite using the following commands:

#### Run All Tests

```bash
npm run test
```

#### Run Specific Integration Test

Adjust the matching patter in the test-it script in package.json and then run:

```bash
npm run test-it
```

These commands will run the tests and provide feedback in the console. Note that those commands will only run the tests on chrome. If you run npm run build-release the tests will be executed on Chrome, Edge, Firefox, Chrome iPhone Simulation and Chrome Android Simulation.

## Release

### Building for Release

1. Bump the version number in package.json, src/chrome/manifest.json and src/firefox/manifest.json

2. To prepare the extension for a release, use the following command which will build the extensions, run tests, and package the extensions into zip files ready for distribution:

```bash
npm run build-release
```

### Release to the extension store

Upload the extension zips you will find in the release_zips directory to the Firefox and Chrome extension store.

## Author

Developed and maintained by Marcus Brandstaetter at Sovendus GmbH. If you have any questions or feedback, feel free to reach out to the author.
