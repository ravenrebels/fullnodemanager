# fullnodemanager
Manage multiple full nodes on the same machine


# You need
You need to have Node.js installed, 
https://nodejs.org/en/


# Step 1
Run "setupNodes", it will create config for 10 full nodes

```node setupNodes```

# Install dependencies
Change working directory to ./manager
Install Node.js dependencies by running command

```npm install ```

# nodes.json
Create a file called nodes.json. 

nodes.json should list your Ravencoin nodes with full path.
Only list the nodes you intend to run. Perhaps you dont start with 10 nodes

See nodes_EXAMPLE.json for inspiration
```
[
  {
    "id": "node1",
    "datadir": "c:\\ravennodes\\fullnodemanager\\fullnode_1"
  }
]

```

# Start your nodes

Start the nodes you want to run.
Perhaps you start with just one.

Change directory to c:\\ravennodes\\fullnodemanager\\fullnode_1
run 

Optional: if you are on windows you can run ``` title N1 ```. That will set the name of the command window to N1.


```ravend -datadir=. ```

Your node is now up and running.

# Fetch meta-data from your nodes
Now your nodes are running and of course you wanna check their state.

Go to directory ./manager
run command

```node worker ``` 

worker is a process that will fetch meta-data from your nodes every X seconds and place the data in the ./data folder

# Graphical user interface (GUI) for you meta-data

In folder ./manager
run the command
``` npx serve ```

Open your web browser http://localhost:5000

The web page shows the current status of your nodes.
Refresh the page for updates.

The web page is accessible in your network.
Let say your desktop computer has ip 192.168.1.55 then you can access the page from your smart phone on URL http://192.168.1.55:5000

# MISC

### Path
add ravend and raven-cli to your as environment variables/path
```
C:\Program Files\Raven
C:\Program Files\Raven\daemon
```
### Starting a node


```ravend -datadir=c:\\ravennodes\\fullnodemanager\\fullnode1```

### Stopping a node

``` raven-cli -datadir=c:\\ravennodes\\fullnodemanager\\fullnode1 stop```

### Performance and Anti-virus software
Tell your anti-virus program to exclude ravend

https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26








