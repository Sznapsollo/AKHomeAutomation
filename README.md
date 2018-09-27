# AKHomeAutomation

## About

AKHomeAutomation is Raspberry Pi based home automation / smart home / smart house solution based on common and cheap components, works realiably and I think is very convenient to use.

### Main goal for this home automation system was to create something that:
- would work inside of local network and be accessible from any device whether it is computer, phone or tablet for convenient use.
- not to be dependent in any way on anything outside of local network – there are no connections to cloud or some 3rd party services. It is all „inside” of local and independent from outside world. Internet is not needed here – just internal network will suffice.
- most important initial feature of this system was delayed auto disable. Devices that you configure into the system do not have to have that feature enabled but it definately turns out very practical in everyday usage – especially for lamp devices.

### What it currently provides:
- web interface which allows to operate defined devices to anyone from your home network
- it allows control over radio operated devices/power switches
- it allows control over web operated devices/power switches
- provides way to define scheduled working periods for devices by simply clicking in UI
- allows to define auto disable option with delay times after which devices would be turned off (energy saving for forgetting and salvation for lazy ones ;-))
- allows to define PIR sensor(s) connected to Raspberry pi and basing on their signal can operate defined devices and/or trigger alarm/sen alarm mails
- can be easily integrated with Google Voice kit to use voice commands. Example script in one of my repositories.

### How it looks
- under **<a href="http://cultrides.com/test/Github/AKHomeAutomation" target="_blank">UI Demo address</a>** you can have a peek at user interface of AKHomeAutomation. It is just UI deployed on shared host with no functionality attached so you will not be able to do anything. It is just to present UI how it displays nodes, scheduling options  etc. It is generated from same nodes.json that is uploaded here.

## Installation & Usage

- **<a href="https://github.com/Sznapsollo/AKHomeAutomation/blob/master/Readme_HomeAutomation_instructions.pdf" target="_blank">Readme_HomeAutomation_instructions.pdf</a>** file contains detailed description of all that I think is important to make this system work and understand how it works/present it/deploy it. I am not very skilled at doc creation so if I missed something or described in not very clear manner let me know I will try to make it better
- this **<a href="https://www.youtube.com/watch?v=C19ARWDYR3c&list=PLjd2MVjW6mhFygrvXyVcdNoq6pHK8MdUW" target="_blank">AKHomeAUtomation Youtube playlist</a>** will contain any vids that I make regarding this system. So far I have made some describing in short radio switches connecting and in general how this works

## What you need to run it

- described in detail in **<a href="https://github.com/Sznapsollo/AKHomeAutomation/blob/master/Readme_HomeAutomation_instructions.pdf" target="_blank">Readme_HomeAutomation_instructions.pdf</a>**
- to run the system you just need Raspberry Pi with Apache + PHP configured, Python is also used but it is by default included in Raspbian. Configuration is described in instructions above.
- to control radio controller power switches you would need such switches and RF radio transmitter like **XY-FST**
- to control web controlled power switches you would need such switches - **SONOFF** devices are ideal for this with custom scripts uploaded. I use such scripts but have not yet uploaded them here will probably do so in the feature with some explanation hot to flash these switches.
- to use pir sensor you would need pir sensor for Raspberry PI like **HC SR501**

## Notes
- enjoy it but also be responsible with it. Do not rely on radio controlled switches to connect them to some heavy-duty stuff that might prove dangerous (for example. dont operate owen with it or dont rely on it regarding some security devices - radio controllers may fail and they can also be easily fooled).
- if you have questions/suggestions you can contact me through githum account mail, youtube and also i have placed mail in Readme_HomeAutomation_instructions.pdf

Take care!
Wanna touch base? office@webproject.waw.pl

## Example Screens

##### Set timeout disable when enabling device (optional)
![Image of AKHomeAutomation #1](http://cultrides.com/test/Github/AKHomeAutomation/screen2.JPG)

##### Set scheduled regular actions defining when device should be ON and when OFF (optional)
![Image of AKHomeAutomation #1](http://cultrides.com/test/Github/AKHomeAutomation/screen1.JPG)

##### Example homepage with some configured devices
![Image of AKHomeAutomation #1](http://cultrides.com/test/Github/AKHomeAutomation/screen3.JPG)
