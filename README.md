<img alt="Icon" src="https://addons.mozilla.org/static-server/img/addon-icons/default-64.d144b50f2bb8.png" width="128px">
![Mozilla Add-on](https://img.shields.io/amo/v/OHTP@EasonWong?color=blue&label=version)
![Experimental](https://img.shields.io/badge/-experimental-blueviolet)

# Tab Preview On Hover

Adds on-hover tab preview to Firefox (requires CSS theme)

<a href="https://addons.mozilla.org/firefox/addon/tab-preview-on-hover/" target="_blank">
    <img width="178" height="48" src="https://github.com/easonwong-de/Tab-Preview-On-Hover/blob/main/Badges/Get_Addon_Badge_Firefox.png?raw=true">
</a>

## What Does The Add-on & CSS theme Do

With the add-on and the <a href="https://raw.githubusercontent.com/easonwong-de/Tab-Preview-On-Hover/main/CSS%20Theme/userChrome.css">supporting CSS theme</a>, tab preview will appear when a tab is hovered over.

<img alt="Tab Preview On Hover" src="https://addons.mozilla.org/user-media/previews/full/281/281109.png" width="80%">
<img alt="Tab Preview On Hover" src="https://addons.mozilla.org/user-media/previews/full/281/281110.png" width="80%">

There will be a delay before tab preview shows up. At the same time, if the cursor hovers from one tab over another tab, there’ll be no delay. If the cursor leaves the tab area for a short moment and goes back, the delay will come back. The behaviour is controlled by the CSS theme, user can simply change <code>--preview-delay</code> and <code>--preview-delay-tolerance</code> to adjust the timing.

## Compromises

1. Only the first ten tabs will have tab preview.
2. <a href="https://github.com/easonwong-de/Adaptive-Tab-Bar-Color">Adaptive Tab Bar Color</a> might cause the tab preview to disappear sometimes, it’s because it resets theme.
