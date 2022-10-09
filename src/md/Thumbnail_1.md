[인트로: TM4C123 LED Blinking](#introduction)
- [재료 (Prerequisite) ](#prerequisite)
- [개발 환경 설정(IDE)](#IDE)

[회로도 (Schematic Diagram)](#SchematicDiagram)
[소스 코드(Source Code)](#SourceCode)

## Introduction 

### 재료 (Prerequisite)
본 프로젝트에서 사용될 보드 및 준비 재료입니다.
보드를 제외한 다른 컴포넌트가 없더라도, IDE 디버깅 Simulator를 통해 코드의 흐름을 파악할 수 있습니다.
```
	 - TM4C123GXL Launchpad by Texas Instrument (*)
	 - 1ep Breadboard
	 - 2ep Wire jumpers
	 - 1ep LED component
	 - 1ep 10kΩ register 
	 /* Required/
```

### 개발 환경 설정 (IDE)
본 프로젝트에서 사용할 IDE는 [IAR Workbench](https://www.iar.com/products/architectures/arm/iar-embedded-workbench-for-arm/)입니다.
Visual Studio, Eclipse, Terminal 등 원하시는 개발 환경에서 구현해 주셔도 됩니다. 
다만, IAR를 선택한 이유로는 Disassembly Code를 통해 Register, Memory등을 시각화 하여 이해하기 편하기 때문입니다. 

프로젝트 생성 과정은 다음과 같습니다.
1. tab > project > Create New Project > C > main 
2. Save project file on your Desktop folder 

본 프로젝트에서는 Stack, Heap 사이즈 등을 설정할 필요가 없기 때문에 default 상태에서 진행합니다.

만약 Components가 존재하지 않아 Simulator로 코드를 작동하는 경우 
> **Simulator Mode**
> 
> tab > project > Options > General Options > Target > Core > Cortex-M4
> tab > project > Options > Debugger > Driver > Simulator
 
 Components가 존재하는 경우
 >  **TI Stellaris Mode**
 >  
 > tab > project > Options > General Options > Target > Device > TexasInstruments > TM4C > TexasInstruments TM4C1236H6PM
 > tab > project > Options > Debugger > TI Stellaris 
 
## 회로도 (Schematic Diagram)

