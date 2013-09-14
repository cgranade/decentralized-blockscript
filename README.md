decentralized-blockscript
=========================

Userscripts and blocklists for social media blocking.

Installation
------------

To install Decentralized Blockscript, you currently must use either Firefox or Chrome (with the [GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or [TamperMonkey](tampermonkey.net) extensions, respectively). In either of these browsers, simply visit the [latest version of the userscript ](https://github.com/cgranade/decentralized-blockscript/raw/master/blockscript.user.js) from this repository, and you will be prompted to install and give this script permissions.

Once you do so, the script will modify the Twitter website from within your browser, adding a new *Blocklist Settings* option to the main Twitter settings menu and blocking users in your currently subscribed blocklists. By default, only the example blocklist is subscribed (this example blocks only @cgranade, the primary author of the userscript), but the subscription options can be changed from *Blocklist Settings* (note that for now, the settings panel only supports subscribing to one blocklist at a time; this limitation will be removed soon, hopefully).

Blocklist Format
----------------

Blocklists must be formatted as JSON files similar to the [example provided with this repository](https://github.com/cgranade/decentralized-blockscript/blob/master/blocklist-example.json). The ``"twitter"`` section of each blocklist is a list of objects, each of which specifies a screen name to be blocked, and optionally, a reason for their blocking. It is recommended that such blocklists be maintained in Git or similarly decentralized repositories, so that changes can be readily tracked and recorded.
