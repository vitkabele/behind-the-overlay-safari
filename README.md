#  Behind The Overlay (Safari version)

Hide annoying overlays on various websites.

## Usage

So far I am not enrolled in the Apple Developer's Program and therefore I am not able to produce installable application.
To use the software in this repository, you must clone it and install via XCode.

## How does it work?

When activated (by clicking on the icon), the extension code looks for the DOM element with highest Z-Index in the centre of the screen.
If the element is considered to be an overlay box, it is removed by adjusting its CSS properties.

It generally works pretty well, but sometimes the websites uses some tricky background blurring which is not detected.

## Disclaimer

This application is inspired by the [NicolaeNMV/BehindTheOverlay](https://github.com/NicolaeNMV/BehindTheOverlay) browser extension for Firefox and Chrome.
I just ported the code to the Safari WebExtension and created icons to make it look nice (sigh, but I did my best!) on macOS.

## License

This application is derived work of the original project which is licensed under the GPL license.
Same license therefore applies to this application.
