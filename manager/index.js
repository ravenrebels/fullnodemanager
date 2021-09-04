/*
    ... is responsible for fetching and displaying informations about peers
*/
class PeerInfo extends HTMLElement {
  /* After the element has been added to the page */
  expanded = false;
  async connectedCallback() {
    const id = this.getAttribute("id");

    const response = await fetch("/data/" + id + "_getpeerinfo.json");
    this.peers = await response.json();

    const infoResponse = await fetch("/data/" + id + "_getnetworkinfo.json");
    this.networkInfo = await infoResponse.json();

    this.render();
  }

  render() {
    if (!this.peers) {
      return;
    }
    let address = {};
    if (this.networkInfo && this.networkInfo.localaddresses.length > 0) {
      address = this.networkInfo.localaddresses[0];
    }

    this.innerHTML = "";
    const container = document.createElement("div");
    this.appendChild(container);

    const inbound = this.peers.filter(function (peer) {
      return peer.inbound;
    });
    container.innerHTML = `<section>     
    <ul>
     <li>${address.address}:${address.port}</li>
     <li>network score: ${address.score}</li>
     <li>${this.peers.length} peers</li> 
     <li>Inbound: ${inbound.length}</li>
    </ul>
      <button type="button" class="btn btn-primary">Expand/collapse</button>      
      <table></table>
    </section>`;
    container.querySelector("button").addEventListener("click", () => {
      this.expanded = !this.expanded;
      this.render();
    });
    if (this.expanded === false) {
      return;
    }
    const table = container.querySelector("table");
    table.classList.add("table");
    table.innerHTML = `
<table>
  <thead>
    <tr>
      <th>Id</th>
      <th>Address</th>
      <th>Inbound</th>
      </tr>
    </thead>
  <tbody></tbody>
</table>`;

    this.peers.map(function (peer) {
      if (peer.inbound === false) {
        return;
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `<tr>
                            <td>${peer.id}</td>
                            <td>${peer.addr}</td>
                            <td>${peer.inbound}</td>
                        </tr>`;
      table.querySelector("tbody").appendChild(tr);
    });
  }
}

customElements.define("peer-info", PeerInfo);

class BlockchainInfo extends HTMLElement {
  async connectedCallback() {
    const id = this.getAttribute("id");

    const url = "/data/" + id + "_getblockchaininfo.json";
    const response = await fetch(url);
    this.blockchainInfo = await response.json();
    this.render();
  }

  render() {
    this.innerHTML = `<section>
      <h1> Node ${this.getAttribute("id")} </h1>
         Block ${this.blockchainInfo.blocks.toLocaleString()}, headers: ${this.blockchainInfo.headers.toLocaleString()}
      </ul>
    </section>`;
  }
}
customElements.define("blockchain-info", BlockchainInfo);

//add stuff to DOM
async function updateDOM() {
  const url = "./nodes.json";
  const response = await fetch(url);
  const nodes = await response.json();
  //For each node
  nodes.map(function (node) {
    const block = document.createElement("blockchain-info");
    block.setAttribute("id", node.id);

    document.getElementById("app").appendChild(block);

    const peer = document.createElement("peer-info");
    peer.setAttribute("id", node.id);
    document.getElementById("app").appendChild(peer);
  });
}

updateDOM();
