# idleon-hack-client
idleon hack client made with help of people on fearless revolution<br />
<br />
```
features:
  working keybinds
  working event logger
  working gui
  custom popup
  custom prompt
```
```
working on:
  kill all 🗸
  mob drop edit x
  inventory edit x
  skills edit x
  gui creator 🗸
  shop edit x
  event logger 🗸
  Chat console x
  name spoof x
```
```
credits:
  valleymon: https://fearlessrevolution.com/memberlist.php?mode=viewprofile&u=127209
  > helped me with gui and events kind of
  
  iBelg: https://fearlessrevolution.com/memberlist.php?mode=viewprofile&u=45315
  Tool release:	https://fearlessrevolution.com/viewtopic.php?p=199352#p199352
  > The creator of the console injection, designer of the old cheats syntax as well as many cheats
  
  salmon85: https://fearlessrevolution.com/memberlist.php?mode=viewprofile&u=80266
  > Wipe inv, wipe forge and class lvl command
  
  Creater0822: https://fearlessrevolution.com/memberlist.php?mode=viewprofile&u=10529
  Google Drive:   https://drive.google.com/drive/folders/1MyEkO0uNEpGx1VctMEKZ5sQiNzuSZv36?usp=sharing
  > For the remaining commands
  
  tympanicblock61: https://fearlessrevolution.com/memberlist.php?mode=viewprofile&u=110004
  > creator of rest of the cheats and gui, events logger, keybinds, custom prompt, custom alert
```
```
info:
  not all cheats have been ported and more will be in the future
  this is my personal project and not many people help me with it
  so its mostly me working on it.
  # Compile instructions
    Your first time installation of NodeJS:
    1) Install NodeJS: 
    2) npm install -g pkg
    The package which lets you build executables. For each new major build, you'd have to reinstall pkg.

    The building procedure:
    0) Have the source file in a new folder and open Powershell there
    1) npm init -y
    Generates a package.json file
    2) npm install -S child_process chrome-remote-interface atob btoa prompt
    These are all the packages that iBelg's tool uses
    3) Edit the json file, e.g. give it a name, version, don't forget to keep ibelg's name in the author section.
    4) Check which node version you have if you don't know, by using the command: node -v
    4) Inside "Scripts": {} add:
    "build": "pkg main.js --targets node17-win-x64 --compress Brotli --output InjectMenuV1"
    Or depending of what your major node version is, for example 14, you'd of course write node14-win-x64 instead.
    5) Execute: npm run build
```
