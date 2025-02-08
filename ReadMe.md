# Helios.js

## Overview
Helios.js is a script designed to manage and quickly resolve sight and lighting issues for tokens in virtual tabletop games. This script facilitates changes to a token's vision and lighting settings with easy-to-use chat commands, enabling a game master (GM) to modify dynamic lighting, vision types, and light emission properties on the fly.

## Features
- Toggle dynamic lighting for the entire map or for specific tokens.
- Configure tokens with preset vision and lighting configurations such as daylight, darkvision, or torchlight.
- Copy and paste sight settings between tokens.
- Enable or disable sight and lighting conditions instantly.

## Commands
The following chat commands are available for GMs:

- `!Helios help`: Display the help message.
- `!Helios justFixIt [true/false](optional)`: Quickly set up or disable all sight-related settings. Optional parameter determines whether or not daylight is on.
- `!Helios copy`: Copy the sight settings of the selected tokens.
- `!Helios paste`: Paste the copied sight settings onto the selected tokens.
- `!Helios blind [true/false](optional)`: Remove or grant basic sight to the selected tokens.
- `!Helios darkvision [true/false](optional) [distance](optional)`: Set up custom darkvision for the selected tokens.
- `!Helios vision [true/false](optional) [distance](optional)`: Set up custom vision for the selected tokens.
- `!Helios torch [true/false](optional) [distance](optional)`: Configure light emission similar to a torch for the selected tokens.
- `!Helios day [true/false](optional)`: Control the daylight setting for the page.
- `!Helios night [true/false](optional)`: Control the nighttime setting for the page.
- `!Helios inside [true/false](optional)`: Alternative command for controlling daylight, where "inside" means no daylight.
- `!Helios dynamicLighting [true/false](optional)`: Toggle dynamic lighting for the page of the selected token.
- `!Helios play [sound]`: Play a sound
- `!Helios stop [sound]`: Stop a sound
- `!Helios stopAll`: Stop all sounds
- `!Helios image`: Post the tokens bio images with his character name
- `!Helios pimage`: Post the tokens bio images without any name
- `!Helios lewts`: Post line separated gm notes for selected token
- `!Helios race`: Attempt to guess dark vision and vision based on the selected tokens characters race
You may also use the shortform `!H` instead of `!Helios` for all commands.

## Usage
To use Helios.js, you must be a GM in a virtual tabletop game that supports scripting, such as Roll20. The commands can be entered into the chat, and the script will interact with the selected tokens according to the parameters given.

To make changes, first, select a token, then use the appropriate `!Helios` command in the chat, followed by any optional parameters.

If a command has optional parameters, you may use them in the following fashion:
`!Helios command`
`!Helios command true`
`!Helios command true 60`

## Installation
1. Copy the Helios.js script into your game's script editor.
2. Ensure that you have the necessary permissions to run scripts as a GM.
3. Reload your game or restart the API sandbox to initialize the script.

## Requirements
- A Roll20 Pro account to use custom scripts.
- GM permissions to execute the script commands.

## Developer Information
Helios.js is an open-source project. Should you encounter any issues or have feature requests, you can contribute to the project by submitting issues or pull requests to its repository.
