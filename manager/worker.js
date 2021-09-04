const { execSync } = require("child_process");
const fs = require("fs");

const axios = require("axios");

let nextUpdate = new Date();
const nodes = require("./nodes.json");

console.info("Start working on ", nodes);

async function work() {
  //Check if it's time to work
  const diff = nextUpdate.getTime() - Date.now();
  process.title = Math.round(diff / 1000) + " seconds to update";
  if (diff > 0) {
    return;
  }
  //Set next update to be in 20 seconds
  nextUpdate.setSeconds(nextUpdate.getSeconds() + 20);
  process.title = "Updating";

  for (const node of nodes) {
    await fetchNodeData(node);
  }
}

async function fetchNodeData(node) {
  process.title = "Processing node " + node.id;

  const config = fs.readFileSync(node.datadir + "/raven.conf", "utf8");
  const rpcuser = getProperty(config, "rpcuser");
  const rpcpassword = getProperty(config, "rpcpassword");
  const rpcport = getProperty(config, "rpcport");

  if (!rpcport) {
    console.log("Skip ", node, "no RPC port specified");
    return;
  }
  const url = "http://127.0.0.1:" + rpcport;

  processCommand("getnetworkinfo");
  processCommand("getpeerinfo");
  processCommand("getblockchaininfo");

  function processCommand(command) {
    rpc(url, rpcuser, rpcpassword, command, []).then(function (info) {
      fs.mkdirSync("./data", { recursive: true });
      const json = JSON.stringify(info, null, 4);
      fs.writeFile(`./data/${node.id}_${command}.json`, json, (error) => {});
    }).catch(e => {
      console.error("Error while connecting to", node.id);
      console.error("CATCH", node.id, config);
    });
  }
}

async function rpc(url, username, password, method, params) {
  const promise = new Promise((resolutionFunc, rejectionFunc) => {
    const options = {
      auth: {
        username,
        password,
      },
    };
    const data = {
      jsonrpc: "1.0",
      id: "n/a",
      method,
      params,
    };

    try {
      const rpcResponse = axios.post(url, data, options);

      rpcResponse.then((re) => {
        const result = re.data.result;
        resolutionFunc(result);
      });
      rpcResponse.catch((e) => {
      
        rejectionFunc(e.response.data);
      });
    } catch (e) {
      rejectionFunc(e);
    }
  });
  return promise;
}

work();
setInterval(work, 2000);

function getProperty(configContent, key) {
  const split = configContent.split("\n");

  for (let a of split) {
    a = a.trim();
    if (a.startsWith(key + "=") === true) {
      return a.substring(a.indexOf("=") + 1);
    }
  }
}
