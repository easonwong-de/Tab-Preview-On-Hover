![Experimental](https://img.shields.io/badge/-experimental-blueviolet)

# Tab-Preview-On-Hover

Adds on-hover tab preview to Firefox (requires CSS theme)  

<img width="80%" alt="Tab Preview On Hover" src="https://user-images.githubusercontent.com/16183548/230820629-db83b208-3187-4630-8a9d-126dff550a16.png">

## How To Set Up

1. Download and unzip this respository
2. Go to <code>about:support</code> and locate profile folder
3. Move <code>CSS Theme > userChrome.css</code> to <code>profile folder > chrome</code>
4. Go to <code>about:config</code> and change <code>toolkit.legacyUserProfileCustomizations.stylesheets</code> to <code>true</code>
5. Go to <code>about:debugging#/runtime/this-firefox</code> and load <code>Add-on > manifest.json</code> as temporary add-on
6. Restart Firefox