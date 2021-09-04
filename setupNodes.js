const fs = require("fs");
const numberOfNodes = 10;

/*
    This script will generate configuration for 10 full Ravencoin nodes
    in sub folder fullnode_1, fullnode_2 etc etc.
    
    RPC user name and passwords will be re-generated each time you run this script.

    The nodes will be configured to index loads of stuff, such as assetindex=1
    This can be optimized in the future, perhaps this is overkill
*/
function getRandom() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
function getConfig(nodeNumber) {
  return `

addressindex=1
assetindex=1
dbcache=512 
listen=1
port=${8870 + nodeNumber}
rpcallowip=127.0.0.1
rpcport=${19570 + nodeNumber}
rpcpassword=${getRandom()}
rpcuser=${getRandom()}
spentindex=1 
server=1
txindex=1
timestampindex=1
upnp=1
whitelist=127.0.0.1
`;
}

for (let i = 1; i <= numberOfNodes; i++) {
  const config = getConfig(i);

  const dir = "./fullnode_" + i;
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(dir + "/raven.conf", config);
}
