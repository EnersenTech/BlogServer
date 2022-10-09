


[인트로: TM4C123GXL LED Blinking](#introduction)
- [재료 (Prerequisite) ](##prerequisite)
- [개발 환경 설정(IDE)](##IDE)

[메인: 과제 수행(Process)](#Process)
- [핀 선정 (Pin Port Select)](##Process1)
- [클락 게이트 활성화 (Clock Gate Open)](##Process2)
- [GPIO-A 포트 디지털 활성화 및 아웃풋 설정 (GPIO-A DEN & DIR)](##Process3)
- [LED 신호 조절 (LED on & off Signal control)](##Process4)

[코드: 소스코드 (Source Code)](#SourceCode)

[시연: 데모 (Demo)](#Demo)
- [영상](##Video)
[참조: 레퍼런스 (Reference)](#Reference)


## Introduction 
TM4C123GXL 보드의 GPIO-A를 통해 LED Blinking을 구현하는 프로젝트입니다.

***

### 재료 (Prerequisite)
본 프로젝트에서 사용될 보드 및 준비 재료입니다.
보드를 제외한 다른 컴포넌트가 없더라도, IDE 디버깅 Simulator를 통해 코드의 흐름을 파악할 수 있습니다.
```
	 - TM4C123GXL Launchpad by Texas Instrument (*)
	 - Texas Instrument Data Sheet pdf (*)
	 - 1ep Breadboard
	 - 2ep Wire jumpers
	 - 1ep LED component
	 - 1ep 10kΩ register 
	 /* Required/
```

&nbsp;  
&nbsp;  
&nbsp;  


### 개발 환경 설정 (IDE)
본 프로젝트에서 사용할 IDE는 [IAR Workbench](https://www.iar.com/products/architectures/arm/iar-embedded-workbench-for-arm/)입니다.
Visual Studio, Eclipse, Terminal 등 원하시는 개발 환경에서 구현해 주셔도 됩니다. 
&nbsp;  
다만, IAR를 선택한 이유로는 Disassembly Code를 통해 Register, Memory등을 시각화 하여 이해하기 편하기 때문입니다. 

프로젝트 생성 과정은 다음과 같습니다.
1. tab > project > Create New Project > C > main  
2. Save project file on your Desktop folder 

본 프로젝트에서는 Stack, Heap 사이즈 등을 설정할 필요가 없기 때문에 default 상태에서 진행합니다.

만약 Components가 존재하지 않아 Simulator로 코드를 작동하는 경우 
> **Simulator Mode**
> 
> tab > project > Options > General Options > Target > Core > Cortex-M4 &nbsp;  
> tab > project > Options > Debugger > Driver > Simulator &nbsp;  
 
 Components가 존재하는 경우
 >  **TI Stellaris Mode**
 >  
 > tab > project > Options > General Options > Target > Device > TexasInstruments > TM4C > TexasInstruments TM4C1236H6PM &nbsp;  
 > tab > project > Options > Debugger > TI Stellaris &nbsp;  

 &nbsp;  
&nbsp;  
&nbsp;  

 
## Process 
***

### 핀 선정 (Pin Port Select)
GPIO (General Purpose Input Output)을 통해 시그널 제어를 시도합니다. 
TM4C123GXL의 [Data Sheet](https://www.ti.com/lit/ds/spms376e/spms376e.pdf?ts=1665291750769&ref_url=https%253A%252F%252Fwww.ti.com%252Ftool%252FEK-TM4C123GXL%253FkeyMatch%253DTM4C123GXL%2BLAUNCHPAD)의 Pin Diagram을 보면 총 64개의 pin을 가지고 있습니다.
&nbsp;  
본 프로젝트에서 GPIO-A를 사용하기 때문에 [Figure.1 Pin Diagram]의 표기된 부분의 핀을 이용합니다. 

![Pin Diagram](https://52.78.195.244:5000/uploads/img/blog_source_1.png) 
&nbsp;  
[Figure.1 Pin Diagram]
&nbsp;  

GPIO는 Microcontroller의 에너지 낭비를 막기 위해 default로 사용할 수 없습니다. 
Clock-Gate를 열어 사용하기 위해서는 사용하고자 하는 GPIO Port의 Register를 활성화 해야합니다. 

&nbsp;  
&nbsp;  
&nbsp;  


### 클락 게이트 활성화 (Clock Gate Open)
System Control Register Map의 RCGCGPIO를 찾아 Clock-Gate를 참조하면 다음과 같이 32-bits Register 맵을 볼 수 있습니다. 
&nbsp;  
![GPIO-Register-Map](https://52.78.195.244:5000/uploads/img/blog_source_2.png)
&nbsp;  
[Figure.2 GPIO Register Map]


R0 Register value가 1일 경우 A port를 활성화 할 수 있습니다. 
&nbsp;  
![GPIO-A-Register](https://52.78.195.244:5000/uploads/img/blog_source_3.png)
&nbsp;  
[Figure.3 GPIO-A Register]
&nbsp;  


[Figure.2]와 [Figure.3]를 이용해 활성화하는 코드는 다음과 같습니다. 
```
 volatile unsigned long *SYSCTL_RCGCGPIO_R;
 SYSCTL_RCGCGPIO_R = (volatile unsigned long *)0x400FE608U; // Base address + Offset address 
 *SYSCTL_RCGCGPIO_R = 0x1U; // R0 Register Enable
```
&nbsp;  
&nbsp;  
&nbsp;  


### GPIO-A 포트 디지털 활성화 및 아웃풋 설정 (GPIO-A DEN & DIR)

GPIO Port A를 활성화 했다면, Register의 Pin에 Digital Enable을 설정해야 합니다. &nbsp;  

Port A의 핀의 갯수는 [Figure.1 Pin Diagram]에서 확인할 수 있듯 PA0 ~ PA7까지 총 8개입니다. &nbsp;  

각 핀의 Enabling value는 다음과 같습니다. 
&nbsp;  
PA0 = 0x1  &nbsp;  
PA1 = 0x2  &nbsp;  
PA2 = 0x4  &nbsp;  
PA3 = 0x8  &nbsp;  
.
.
.
 &nbsp;  

제어하고자 하는 Pin을 찾아서 Digital Enabling을 한 뒤, Data Direction Register를 지정해 주어야 합니다. &nbsp;  
Data Direction Register의 설정은 Output이 될 핀을 설정합니다. &nbsp;  
만약 Data Direction을 [Figure.4 Data Link Line & Data Memory Line]과 같이 같이 모두 열어서 맵핑한다면, 
PA2 핀 뿐만이 아니라, PA*에 데이터도 메모리에 할당할 수 있게 됩니다.   &nbsp;  
해당 경우를 Isolated되었다고 하지 않고, 그 결과 메모리에 원치 않는 값을 맵핑할 수 있으므로 되도록이면 사용할 핀 데이터 라인과 메모리 라인을 Isolate하는 것이 중요합니다. 

![Data-Line-Memory-Adress-Line](https://52.78.195.244:5000/uploads/img/blog_source_4.png) &nbsp;  
[Figure.4 Data Link Line & Data Memory Line]
 &nbsp;  

현재 프로젝트는 1개의 Pin만 사용하므로, Memoery를 1개만 열어주는 것이 좋습니다. &nbsp;  
만약, PA1와 PA2 두 개의 핀을 사용해야한다면, 0x6으로 설정하면 됩니다. &nbsp;  

```
    volatile unsigned long *GPIO_PORTA_DEN_R;
    volatile unsigned long *GPIO_PORTA_DIR_R;

    GPIO_PORTA_DEN_R =  (volatile unsigned long *)0x4000451CU; // GPIO Digital Enable Base address + Offset address 
    GPIO_PORTA_DIR_R =  (volatile unsigned long *)0x40004400U; // GPIO PORTA (APB) Base address + Offset address 


    *GPIO_PORTA_DEN_R = 0x4U;
    *GPIO_PORTA_DIR_R = 0x4U;

```
&nbsp;  
&nbsp;  
&nbsp;  

### LED 신호 조절 (LED on & off Signal control)

Pin Digital Enable 설정과 Pin Data Output mapping이 끝났다면, on 해주면 됩니다. 
&nbsp;  

```
    volatile unsinged long *p_red_led;
    p_blue_led = (unsigned long *)0x40004010U; // 데이터 메모리 라인

    *p_blue_led = 0x4U; // 데이터 링크 라인 PA2
```
&nbsp;  

해당 과정을 거쳤다면, LED가 계속 켜있을 것입니다.  &nbsp;  

Blink를 하기 위해서는 off하는 과정을 반복해야하므로, 다음과 같이 코드로 구현할 수 있습니다. 
```
void delay(volatile long x) {
        while (x > 0){
            --x;
        }
}

volatile int x = 0;
wihle(1) {
    // on 
    *p_blue_led = 0x4U;
    delay(1000000);

    // off
    *p_blue_led = 0x0U;
    delay(1000000);
}
```
&nbsp;  
&nbsp;  
&nbsp;  



## Source Code
***
전체 코드를 보면 다음과 같습니다. 
```
void delay(volatile long x) {
    while(x > 0){
        x--;
    }
}

int main() {
    // GPIO Clock Gate Open
    volatile unsigned long *SYSCTL_RCGCGPIO_R;

    SYSCTL_RCGCGPIO_R = (volatile unsigned long *)0x400FE608U; // Base address + Offset address 

    *SYSCTL_RCGCGPIO_R = 0x1U; // R0 Register Enable

    // GPIO A Digital Enable for PA2
    volatile unsigned long *GPIO_PORTA_DEN_R;

    GPIO_PORTA_DEN_R =  (volatile unsigned long *)0x4000451CU; // GPIO Digital Enable Base address + Offset address 

    *GPIO_PORTA_DEN_R = 0x4U;

    // GPIO A Data Line Mapping for PA2
    volatile unsigned long *GPIO_PORTA_DIR_R;

    GPIO_PORTA_DIR_R =  (volatile unsigned long *)0x40004400U; // GPIO PORTA (APB) Base address + Offset address 

    *GPIO_PORTA_DIR_R = 0x4U;

    // Blue Colour LED Register on & off

    volatile unsigned long *p_blue_led;
    p_blue_led = (unsigned long *)0x40004010U; // 데이터 메모리 라인

    *p_blue_led = 0x4U; // 데이터 링크 라인 PA2 on 
    volatile int x = 0;
    while(1) {
        // on 
        *p_blue_led = 0x4U;
        delay(1000000);

        // off
        *p_blue_led = 0x0U;
        delay(1000000);
    }
    return 0;
}
```
&nbsp;  
&nbsp;  
&nbsp;  


## Demo
*** 
[Demo-Video](https://52.78.195.244:5000/uploads/video/blog_source_5-1.mov)

## Reference
*** 
[Tiva™ TM4C123GH6PM Microcontroller DATA SHEET](https://www.ti.com/lit/ds/spms376e/spms376e.pdf?ts=1665291750769&ref_url=https%253A%252F%252Fwww.ti.com%252Ftool%252FEK-TM4C123GXL%253FkeyMatch%253DTM4C123GXL%2BLAUNCHPAD)