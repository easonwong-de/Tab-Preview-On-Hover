![Icon](https://github.com/easonwong-de/Tab-Preview-On-Hover/blob/main/images/TPOH_128.png)  
![Mozilla Add-on](https://img.shields.io/amo/v/OHTP@EasonWong?color=blue&label=version)

# Tab Preview On Hover

Adds on-hover tab preview to Firefox (requires CSS theme).

<a href="https://addons.mozilla.org/firefox/addon/tab-preview-on-hover/" target="_blank">
    <img src="https://github.com/easonwong-de/Tab-Preview-On-Hover/blob/main/Badges/Get_Addon_Badge_Firefox.png?raw=true" width="178" height="48">
</a>

## What Does the Add-on & CSS Theme Do

With the add-on and the <a href="https://raw.githubusercontent.com/easonwong-de/Tab-Preview-On-Hover/main/CSS%20Theme/userChrome.css">supporting CSS theme</a>, tab preview will appear when a tab is hovered over.

<img alt="Tab Preview On Hover" src="https://addons.mozilla.org/user-media/previews/full/283/283115.png" width="80%">
<img alt="Tab Preview On Hover" src="https://addons.mozilla.org/user-media/previews/full/283/283117.png" width="80%">

There will be a delay before tab preview shows up. At the same time, if the cursor hovers from one tab over another tab, there’ll be no delay. If the cursor leaves the tab area for a short moment and goes back, the delay will come back. The behaviour is controlled by the CSS theme, user can simply change <code>--preview-delay</code> and <code>--preview-delay-tolerance</code> to adjust the timing.

## How to Install the CSS Theme

<ol>
	<li>Go to <code>about:support</code> and locate <code>Profile Folder</code></li>
	<li>Download the <a href="https://raw.githubusercontent.com/easonwong-de/Tab-Preview-On-Hover/main/CSS%20Theme/userChrome.css">CSS theme</a> and move it into <code>Profile Folder -> chrome</code></li>
	<li>Go to <code>about:config</code> and turn <code>toolkit.legacyUserProfileCustomizations.stylesheets</code> to <code>true</code></li>
	<li>Restart Firefox</li>
</ol>

## Compromises

<ol>
	<li>Background image for the browser navbar will be disabled</li>
	<li>Incompatible with built-in browser themes “System theme – auto” and “Firefox Alpenglow”</li>
	<li>Only the first ten tabs on the left will have tab preview</li>
	<li><a href="https://github.com/easonwong-de/Adaptive-Tab-Bar-Colour">Adaptive Tab Bar Colour</a> can cause the tab preview to disappear at times, as it resets the browser theme whenever it changes the colour of the tab bar</li>
</ol>
