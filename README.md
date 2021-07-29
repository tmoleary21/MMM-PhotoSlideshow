# MMM-PhotoSlideshow
This Module makes your Magic Mirror into a Slideshow for your photos. It also adds some helpful (optional) buttons to control the slideshow if you're using a touch screen!

## Preview
![Image of Working Module](screenshot.png)

## Installation
1. Navigate to your `MagicMirror/modules directory`.
2. Use command `git clone https://github.com/tmoleary21/MMM-PhotoSlideshow.git` to clone the repository
3. Edit the configuration file under `MagicMirror/config/config.js`
'''JSON
{
    module: 'MMM-PhotoSlideshow',
    position: 'fullscreen_below',
    config: {
        albumPath: "/",
		    cycleTime: 10000,
		    animationTime: 500
    }
}
'''

## Config
|Option|Description|
|------|-----------|
|albumPath| The path to the directory your photos are stored in. Note: If this path is outside of the `MagicMirror` directory, you will need to create a link to the location. Command: `ln -s PhotoDirectory linkDirectory`|
|cycleTime| The time in milliseconds to wait before moving to the next photo|
|animationTime| The time in milliseconds of the animation to the next photo|
