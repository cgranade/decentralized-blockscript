// ==UserScript==
// @name         Decentralized Block Script
// @namespace    http://www.cgranade.com/
// @version      1
// @description  Performs blocking on social media sites based on user-selected
//               blocklists.
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      http:////netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js
// @match        http://twitter.com/*
// @match        https://twitter.com/*
// @copyright    2013, Christopher E. Granade. Licensed under the AGPLv3 (see
//               source code).
// ==/UserScript==

/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// FUNCTIONS ///////////////////////////////////////////////////////////////////

function loadBlockList() {
    blockList = [];
    blockListSources.forEach(function(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                console.log('got response for URL: ' + url);
                blockees = $.parseJSON(response.response).twitter;
                blockees.forEach(function (blockee) {
                    blockList = blockList.concat([blockee["screen-name"]]);
                });
    			applyBlockList();
            }
        });
    });
}

function applyBlockList() {
    style.text("");
    blockList.forEach(function(blockee) {
        txt = style.text();
        console.log('applying block to: ' + blockee);
        style.text(txt + "*[data-screen-name=" + blockee + "] {display: none;}\n");
    });
}

function loadSettings() {
    if (localStorage["blockListSources"] == undefined) {
        // Since we don't have a configuration GUI at the moment,
        // we need a default. This WILL be removed once a GUI is in place,
        // as no one gets to be specially privileged by this script.
        // Right now, this blocklist only blocks the author of this script,
        // to demonstrate the concept.
        blockListSources = ['https://raw.github.com/cgranade/decentralized-blockscript/master/blocklist-example.json'];
        // Apply the default and save it back to the config store.
        saveSettings();
    } else {
        // FIXME: Commas may not be in URLs yet!
        blockListSources = localStorage["blockListSources"].split(",");
    }
    console.log('loaded blockListSources: ' + blockListSources);
}

function gui_loadSettings() {
    loadSettings();
    srcs = blockListSources;
    if (srcs.length != 0) {
        // TODO: apply multiple URLs.
        $('#blkscript-settings-srcurl').val(srcs[0]);
    }
}

function saveSettings() {
    console.log('saving blockListSources: ' + blockListSources);
    localStorage["blockListSources"] = blockListSources.join(",");
}

function gui_saveSettings() {
    blockListSources = [$('#blkscript-settings-srcurl').val()];
    saveSettings();
    loadBlockList();
}

function createSettingsGUI() {
    // Make an item in the settings dropdown.
    blockListSettingsItem = $('<li><a data-nav="shortcuts" data-toggle="modal" href="#blocklist-settings">Blocklist Settings</a></li>');
    $('#user-dropdown .dropdown-menu').append(blockListSettingsItem);
    console.log('appended menu item');
    
    // Make a panel on the dashboard.
    dashboardItem = $('<div class="module wtf-module js-wtf-module"></div>');
    dashboardItem.html(
        '<div id="blkscript-settings-panel" class="flex-module">' +
            '<div class="flex-module-header">' +
                '<h3>Block Script Settings</h3>' +
            '</div>' +
            '<div class="flex-module-inner">' +
                '<form id="blkscript-settings">' +
                    '<label>Block list URL</label>' +
                    // TODO: make multiple URLs supported.
                    '<input type="text" id="blkscript-settings-srcurl">' +
                        // TODO: put current value here.
                    '</input>' +
                '</form>' +
            '</div>' +
            '<div class="flex-module-footer">' +
                '<div class="btn-group">' +
                    '<button type="button" id="blkscript-settings-save"   class="btn primary-btn">Save</button>' +
                    '<button type="button" id="blkscript-settings-cancel" class="btn">Cancel</button>' +
                '</div>' +
            '</div>' +
        '</div>');
    dashboardItem.hide();
    $('div.dashboard .mini-profile').after(dashboardItem);
    console.log('appended dashboard item');
    
    // Hook up events to the dashboard.
    $('a', blockListSettingsItem).on("click", function() {
        gui_loadSettings();
        dashboardItem.show();
    });
    $('#blkscript-settings-save').on("click", function() {
        gui_saveSettings();
        dashboardItem.hide();
    });
    $('#blkscript-settings-cancel').on("click", function() {
        // Hide the panel.
        dashboardItem.hide();
    });
    console.log('attached events');
}

// GLOBAL VARIABLES ////////////////////////////////////////////////////////////

// Make a list of sources to load blocklists from. We will initialize this
// when the DOM is ready, to avoid slowdown.
blockListSources = [];

// Note that this decision has ethical consequences! The block list is not
// applied until well after the body is loaded, so harassing content may be seen
// briefly. If this is unacceptable, we should modify this behavior to load
// immediately, even at the cost of introducing slowdown and instabilty.

// Make a list of whom to block so far.
blockList = [];

// How often should we refresh?
refreshInterval = 120; // Units: [s]

// Make a style container to hold the block styles.
// TODO: make one per block source, so we can refresh independently.
style = $('<style id="blkscript-style-container"></style>');

// MAIN ////////////////////////////////////////////////////////////////////////

$('body').ready(function() {
    
    // Grab the block sources from the configuration store.
    loadSettings();
    
    // Apply the initial blocklist.
    $('head').append(style);
    console.log('loading initial blocklist:\n\t' + blockListSources);
    loadBlockList();
    
    // Create the settings GUI.
    createSettingsGUI();
    
    // Reload the blocklist every once and a while.
    window.setInterval(function () {
        loadBlockList();
    }, 1000 * refreshInterval);
    
});
