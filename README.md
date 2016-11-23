# <img src="https://www.leafpub.org/content/themes/leafpub/img/logo-color-text.svg" alt="Leafpub" width="300">

**A development of the Casper theme for Leafpub.**

Created by [Steve Pike](https://twitter.com/oztourer)

## Development status

- Pages and posts support comments by registered users, but only where the tag 'comments-allowed' is specified for that page or post. A further tag, 'comments-closed', can be set to prevent further comments from being added to the page or post. At present neither tag is set up when the theme is installed, they need to be added manually in the admin page for tags.

## Installation

- Copy the themes/wildgeese directory to the themes directory of your [Leafpub](https://github.com/Leafpub) installation.
- Install [Leafpub](https://github.com/Leafpub) plugin [Comments](https://github.com/oztourer/Leafpub-comments) if you require comments support.

## Comments support

Pages and posts where comments are permitted must have the tag 'comments-allowed' set. No change to the page will be apparent to viewers who are not signed in until comments are added to the page. Signed in users will see a frame at the bottom of the page allowing a new comment to be created.

Continue to display comments but prevent new comments by setting both tags 'comments-allowed' and 'comments-closed' for a page.

Hide any existing comments for a page by removing tag 'comments-allowed' from that page.

## Versioning

Leafpub is maintained under the [Semantic Versioning guidelines](http://semver.org/) and this plugin attempts to adhere to the same guidelines.

## Developers

**Steve Pike**

- https://twitter.com/oztourer
- https://github.com/oztourer

## License

© 2016 [Steve Pike](https://twitter.com/oztourer)

This software is copyrighted. You may use it under the terms of the MIT license. See LICENSE for licensing details.

