/*
  Based on https://github.com/ninjablocks/433Utils
 */

#include "RCSwitch.h"
#include <stdlib.h>
#include <stdio.h>


int main(int argc, char *argv[]) {
    
    /*
     output PIN is hardcoded for testing purposes
     see https://projects.drogon.net/raspberry-pi/wiringpi/pins/
     for pin mapping of the raspberry pi GPIO connector
     */
    int PIN = 3;
    
    if (wiringPiSetup () == -1) return 1;
	printf("Start \n");


     RCSwitch mySwitch = RCSwitch();
     mySwitch.enableReceive(PIN);  


     while(1) {

      if (mySwitch.available()) {

        int value = mySwitch.getReceivedValue();

        if (value == 0) {
          printf("Unknown encoding");
        } else {

          //printf("Received %i\n", mySwitch.getReceivedValue() );
          printf("KOD, dlugosc kodu bitowo, czas kodu, surowe dane, protokol \n");
          //printf("CODE, binary code lenght, code length [ms] , raw data, protocol \n");
          printf("Received %i %i %i %i %i\n", mySwitch.getReceivedValue(), mySwitch.getReceivedBitlength(), mySwitch.getReceivedDelay(), mySwitch.getReceivedRawdata(),mySwitch.getReceivedProtocol() );
        } 

        mySwitch.resetAvailable();

      } 
    }


    return 0;
}

