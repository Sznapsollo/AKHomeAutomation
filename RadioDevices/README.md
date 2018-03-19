# About

rcswitch-pi is for controlling rc remote controlled power sockets 
with the raspberry pi. Kudos to the projects [rc-switch](http://code.google.com/p/rc-switch)
and [wiringpi](https://projects.drogon.net/raspberry-pi/wiringpi).
I just adapted the rc-switch code to use the wiringpi library instead of
the library provided by the arduino.


## Usage

First you have to install the [wiringpi](https://projects.drogon.net/raspberry-pi/wiringpi/download-and-install/) library.
After that you can compile the example program *send* by executing *make*. 
You may want to changet the used GPIO pin before compilation in the send.cpp source file.
PINS MAPPING
https://projects.drogon.net/raspberry-pi/wiringpi/pins/

## Polish:

Temat z Rasberry PI / Arduino + RF 433
http://www.elektroda.pl/rtvforum/viewtopic.php?p=13685049

Powyzej link jak wiringpi mapuje piny fizyczne na logiczne w bibliotece


-------
Chcialem tutaj zobaczyc jak dziala biblioteka rc-switch ktora uzywalem na Arduino.
Zapewne sa wygodniejsze/nowsze narzedzia dla Raspberry Pi. Poszukaj dla siebie moze znajdziesz cos odpowiedniejszego.
Pierwszy lepszy przykład z brzegu:
  - http://ninjablocks.com/blogs/how-to/7506204-adding-433-to-your-raspberry-pi
  - http://www.raspberrypi.org/forums/viewtopic.php?f=37&t=66946
  - https://github.com/ninjablocks/433Utils
  - http://www.raspberrypi.org/forums/viewtopic.php?f=37&t=65587

Dla mnie wazne bylo to, ze moge uzyc ten sam kod z Arduino w tym projekcie.


Do poczytania:
http://blog.rot13.org/2013/10/433-mhz-power-sockets-with-rc-switch-arduino-or-raspberry-pi.html 
http://www.homautomation.org/2013/09/21/433mhtz-rf-communication-between-arduino-and-raspberry-pi/ 
http://www.mikrocontroller.net/topic/252895 (niemiecki)	

