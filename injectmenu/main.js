const spawn = require('child_process').spawn;
const CDP = require('chrome-remote-interface');
const fs = require('fs').promises;
const atob = require('atob');
const btoa = require('btoa');
const prompt = require('prompt');
const fs_conf = require("fs"); // Used to read the config file
/** Unused dependencies */
//const path = require('path');
//const beautify = require('js-beautify');

// Unban configuration, 0 does nothing and 1 unbans
let config;
try{ config = JSON.parse(fs_conf.readFileSync("./config.json", "utf-8")); } 
catch(err){ 
    if (err.code === "ENOENT") console.log("File not found!");
    else throw err;
    // Default json settings, in case the json file has not been found: Note that you cannot change these presets once compiled
    config = {unban:0, injreg:"\\w+\\.ApplicationMain\\s*?="};
}
// Tool initialization messages
console.log("Tool version 1.1.3 by iBelg, forked by Creater0822, forked again by tympanicblock61");
console.log('InjectMenuV1');
console.log('------------Tool Options------------');
console.log(`Unban: ${config.unban}`);
console.log(`Regex: ${config.injreg}`);
console.log('');

const port = 32123;
let cheatInjected = false;

function attach(name) {
  return new Promise((resolve, reject) => {
    const extractionWsRegex = /^DevTools listening on (ws:\/\/.*$)/;

    const idleon = spawn(name, [`--remote-debugging-port=${port}`]);

    idleon.stderr.on('data', (data) => {
      let string = data;
      if (data instanceof Buffer) {
        string = data.toString('utf8');
      }
      const match = string.trim().match(extractionWsRegex);
      if (match) {
        console.log(`Attached to ${name}`)
        resolve(match[1]);
      }
    });
  });
}

async function setupIntercept(hook) {
  const options = {
    tab: hook,
    port: port
  };

  const client = await CDP(options);

  const { Network, Runtime } = client;
  console.log('Injecting cheats...');

  const cheats = await fs.readFile('cheats.js', 'utf8');

  const cheatsScript = `
  window.executeCheat = function(action) {
    const context = window.document.querySelector('iframe').contentWindow.__idleon_cheats__;
    return cheat.call(context, action);
  };

  ${cheats}

  console.log('Loaded cheats!');
  `;
  
  await Network.setRequestInterception(
    {
      patterns: [
        {
          urlPattern: '*Z.js',
          resourceType: 'Script',
          interceptionStage: 'HeadersReceived',
        }
      ]
    }
  );
  await Runtime.enable();
  await Runtime.evaluate({ expression: cheatsScript });
  console.log('Step 1 complete...');

  Network.requestIntercepted(async ({ interceptionId, request }) => {
    const response = await Network.getResponseBodyForInterception({ interceptionId });
    const originalBody = atob(response.body);
    // Regex definitions
    const InjReg = new RegExp(config.injreg);
    const InjRegG = new RegExp(config.injreg,"g");
    const VarName = new RegExp("^\\w+"); // The randomly generated variable name could have more than one character, thus this Regex

    const AppMain = InjRegG.exec(originalBody);
    const AppVar = Array(AppMain.length).fill("");
    // A for-loop has been implemented, but there should only be one unique occasion, hence ${AppVar[0]}
    for(i=0; i < AppMain.length; i++) AppVar[i] = VarName.exec(AppMain[i])[0];

    let newBody; // replace some code
    if(config.unban == 0) newBody = originalBody.replace(InjReg, (m) => `window.__idleon_cheats__=${AppVar[0]};${m}`);
    else if(config.unban == 1) newBody = originalBody.replace(InjReg, (m) => `window.__idleon_cheats__=${AppVar[0]};${m}`).replaceAll(
      /b\.engine\.getGameAttribute\("OptionsListAccount"\)\[26\]\s*?=\s*?\d{1,}/g, `b.engine.getGameAttribute("OptionsListAccount")[26]=0`).replaceAll(
      /cleanMarkedFiles\(\!0\)/g,`cleanMarkedFiles(!1)`
    );

    console.log('Step 2 complete...');
    const newHeaders = [
      `Date: ${(new Date()).toUTCString()}`,
      `Connection: closed`,
      `Content-Length: ${newBody.length}`,
      `Content-Type: text/javascript`,
    ];
    const newResponse = btoa(
      "HTTP/1.1 200 OK\r\n" +
      newHeaders.join('\r\n') +
      "\r\n\r\n" +
      newBody
    );

    Network.continueInterceptedRequest({
      interceptionId,
      rawResponse: newResponse,
    });
    console.log('Step 3 complete...');
    console.log('Cheat injected!');
    cheatInjected = true;
  });
  return client;
}

(async function () {
  const hook = await attach('LegendsOfIdleon.exe');
  const client = await setupIntercept(hook);

  const handle = setInterval(async () => {
    if (cheatInjected) {
      clearInterval(handle);
      prompt.start();

      //let action;
      //while (action !== 'exit') {
      //  let { Action } = await prompt.get(['Action']);
      //  const { Runtime } = client;
      //  const { result } = await Runtime.evaluate({ expression: `executeCheat('${Action}')` });
      //  console.log(result.value);
      //  // A console command to close the game and injector
      //  if(result.value === "exit") window.close();
      //}
    }
  }, 500);
})();