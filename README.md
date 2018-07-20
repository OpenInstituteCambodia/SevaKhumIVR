# សេវាឃុំ!

**សេវាឃុំ** (Seva Khum) application have been developed with ionic 1 framework. The app provide useful information via text content and sound of Cambodia commune public service.


## Download

You can download project source code [Here](github.com).
You can also clone it in our repository.

## Requirment

 1. First, install [Node.js](https://nodejs.org/en/).  
 2. Then, install the latest Ionic command-line tools in your terminal. Follow the  [Android](https://cordova.apache.org/docs/en/8.x/guide/platforms/android/) and [iOS](https://cordova.apache.org/docs/en/8.x/guide/platforms/ios/)   platform guides to install required tools for development.

    `npm install -g ionic`

 3. Then, install the corodva platform.
  `npm install -g cordova`
  4. You need to install JDK 1.8 
  5. Download Android SDK and add $ANDROID_HOME to your environment path.

## Using this project

Open Command Line and change directory to your project directory, then run the following command:

    npm install
    ionic cordova prepare
    ionic cordova platform add android
    ionic cordova run android

You can update the content in file `index.html` in  `www` directory, then run the following command to deploy to your phone.

    ionic cordova run android

# Publish App

To generate a release build for Android, we can use the following cordova cli command:
```
ionic cordova build --release android
```
You can follow this guide for more information: [Publishing your app](https://ionicframework.com/docs/v1/guide/publishing.html)