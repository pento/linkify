Linkify
=======

WordPress has an excellent feature, where pasting a URL onto selected text will automatically transform that text into a link.

Now you can do it everywhere!

## Installation

[Chrome Web Store](https://chrome.google.com/webstore/detail/linkify/bkkgikibkmalecfagnebbhbacnbhckmh) | [Firefox Extensions](https://addons.mozilla.org/en-US/firefox/addon/linkify-magic-links/)

## Screenshots

![Pasting a link in WordPress' Quick Draft](assets/screenshots/1.png) ![Pasting a link in GMail](assets/screenshots/2.png)

## Development

### Installation
    git clone git@github.com:pento/linkify.git

### Build instructions

To install dependencies:

    cd linkify
    npm install

Then to start a developing session (with watch), run:

    npm watch

This will create an unpacked version of Linkify in the `distribution` directory, which you can load in Chrome using the `Load unpacked extension...` button in your [Chrome Extensions](chrome://extensions/) page.

![Linkify running as an unpacked extension, with the `Load unpacked extension...` button displayed](assets/screenshots/load-chrome-extension.png)
