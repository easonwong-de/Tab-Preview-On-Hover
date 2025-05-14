![Icon](https://github.com/easonwong-de/Tab-Preview-On-Hover/blob/main/images/TPOH_128.png)  
![Mozilla Add-on Users](https://img.shields.io/amo/users/tab-preview-on-hover)
![Mozilla Add-on Rating](https://img.shields.io/amo/stars/tab-preview-on-hover)
![Mozilla Add-on](https://img.shields.io/amo/v/OHTP@EasonWong?color=blue&label=version)

# Tab Preview On Hover (Discontinued)

This add-on adds on-hover tab preview to Firefox (requires CSS theme).

**Note:** This add-on is now discontinued as Mozilla has since integrated tab preview functionality directly into Firefox.

<a href="https://addons.mozilla.org/firefox/addon/tab-preview-on-hover/" target="_blank">
	<img src="https://github.com/easonwong-de/Tab-Preview-On-Hover/blob/main/Badges/Get_Addon_Badge_Firefox.png?raw=true" width="178" height="48">
</a>

## What Does the Add-on & CSS Theme Do?

With the add-on and the [supporting CSS theme](https://raw.githubusercontent.com/easonwong-de/Tab-Preview-On-Hover/main/CSS%20Theme/userChrome.css), a tab preview will appear when a tab is hovered over.

<img width="45%" src="https://addons.mozilla.org/user-media/previews/full/283/283115.png"> <img width="45%" src="https://addons.mozilla.org/user-media/previews/full/283/283117.png">

There will be a short delay before the tab preview appears. If the cursor moves from one tab to another, there will be no delay. However, if the cursor leaves the tab area for a brief moment and then returns, the delay will reappear. This behaviour can be controlled via the CSS theme. Users can modify the following variables to adjust the timing:

- `--preview-delay`  
- `--preview-delay-tolerance`

## How to Install the CSS Theme

1. Go to `about:support` and locate the `Profile Folder`.
2. Download the [CSS theme](https://raw.githubusercontent.com/easonwong-de/Tab-Preview-On-Hover/main/CSS%20Theme/userChrome.css) and move it into `Profile Folder -> chrome`.
3. Go to `about:config` and set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
4. Restart Firefox.

## Compromises

1. The background image for the browser navbar will be disabled.
2. Incompatible with the built-in browser themes “System theme – auto” and “Firefox Alpenglow”.
3. Only the first ten tabs on the left will have tab previews.
4. [Adaptive Tab Bar Colour](https://github.com/easonwong-de/Adaptive-Tab-Bar-Colour) may cause the tab preview to disappear at times, as it resets the browser theme whenever it changes the tab bar colour.
