const creatures = [
  '🐙', '🐷', '🐬', '🐞',
  '🐈', '🙉', '🐸', '🐓',
  '🐊', '🕷', '🐠', '🐘',
  '🐼', '🐰', '🐶', '🐥'
]
function handleError(e) {
  console.error(e.stack)
  statusElm.innerHTML = e.message
}
export default async (v,p,c,obj,r) => {
  const outputHeaderElm = obj.this.shadowRoot.getElementById("output-header")
  const outputElm = obj.this.shadowRoot.getElementById("output")
  const statusElm = obj.this.shadowRoot.getElementById("status")
  const dbnameField = obj.this.shadowRoot.getElementById("dbname")
  const dbAddressField = obj.this.shadowRoot.getElementById("dbaddress")
  const createButton = obj.this.shadowRoot.getElementById("create")
  const openButton = obj.this.shadowRoot.getElementById("open")
  const createType = obj.this.shadowRoot.getElementById("type")
  const writerText = obj.this.shadowRoot.getElementById("writerText")
  const publicCheckbox = obj.this.shadowRoot.getElementById("public")
  const readonlyCheckbox = obj.this.shadowRoot.getElementById("readonly")

  let db
  let count = 0
  let interval = Math.floor((Math.random() * 300) + (Math.random() * 2000))
  let updateInterval
  let dbType, dbAddress
  // If we're building with Webpack, use the injected IPFS module.
  // Otherwise use 'Ipfs' which is exposed by ipfs.min.js
  // If we're building with Webpack, use the injected OrbitDB module.
  // Otherwise use 'OrbitDB' which is exposed by orbitdb.min.js
  // Init UI
  // openButton.disabled = true
  // createButton.disabled = true
  statusElm.innerHTML = "Starting IPFS..."

  // Create IPFS instance
  let ipfs = await Ipfs.create({
    repo: './db',
    start: true,
    preload: {
      enabled: false
    },
    EXPERIMENTAL: {
      pubsub: true,
    },
    config: {
      Addresses: {
        Swarm: [
          // Use IPFS dev signal server
          // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
          // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
          // Use IPFS dev webrtc signal server
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
          // Use local signal server
          // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
        ]
      },
    }
  })

  // openButton.disabled = false
  // createButton.disabled = false
  statusElm.innerHTML = "IPFS Validate address"
  let isValidAddress = OrbitDB.isValidAddress('/orbitdb/zdpuApCvxfEFug6uohbADwnsBvBBxSdHaq1WTD6ES8cKmxN14/web3')
  console.log('isValidAddress', isValidAddress)
  statusElm.innerHTML = "IPFS Started"
  let orbitdb = await OrbitDB.createInstance(ipfs, {
    directory:'./orbit-of-venus'
  })
  obj['orbitdb'] = orbitdb

  const load = async (db, statusText) => {

    // Set the status text
    statusElm.innerHTML = statusText

    // When the database is ready (ie. loaded), display results
    db.events.on('ready', () => {

      console.log('~~~~~~~~~ ready ~~~~~~~~~~~')
      return queryAndRender(db)
    })
    // When database gets replicated with a peer, display results
    db.events.on('replicated', () => {
      console.log('~~~~~~~~~ replicated ~~~~~~~~~~~')
     return queryAndRender(db)
    })
    // When we update the database, display result
    db.events.on('write', () => {

      console.log('~~~~~~~~~ write ~~~~~~~~~~~')
      return queryAndRender(db)
    })

    db.events.on('replicate.progress', () => queryAndRender(db))

    // Hook up to the load progress event and render the progress
    let maxTotal = 0, loaded = 0
    db.events.on('load.progress', (address, hash, entry, progress, total) => {
      loaded ++
      maxTotal = Math.max.apply(null, [maxTotal, progress, 0])
      total = Math.max.apply(null, [progress, maxTotal, total, entry.clock.time, 0])
      statusElm.innerHTML = `Loading database... ${maxTotal} / ${total}`
    })

    db.events.on('ready', () => {
      console.log('~~~~~~~~~ ready ~~~~~~~~~~~')
      setTimeout(() => {
        statusElm.innerHTML = 'Database is ready'
      }, 1000)
    })

    // Load locally persisted database
    await db.load()
  }

  const startWriter = async (db, interval) => {
    // Set the status text
    writerText.innerHTML = `Writing to database every ${interval} milliseconds...`

    // Start update/insert loop
    updateInterval = setInterval(async () => {
      try {
        await update(db)
      } catch (e) {
        console.error(e.toString())
        writerText.innerHTML = '<span style="color: red">' + e.toString() + '</span>'
        clearInterval(updateInterval)
      }
    }, interval)
  }

  const resetDatabase = async (db) => {
    writerText.innerHTML = ""
    outputElm.innerHTML = ""
    outputHeaderElm.innerHTML = ""

    clearInterval(updateInterval)
    if (db) {
      await db.close()
    }

    interval = Math.floor((Math.random() * 300) + (Math.random() * 2000))
  }

  const createDatabase = async (nameOfDatabase) => {
    await resetDatabase(db)

    // openButton.disabled = true
    // createButton.disabled = true

    try {
      const name = nameOfDatabase
      const type = 'docstore'
      const publicAccess = true
      db = await obj['orbitdb'].open(name, {
        // If database doesn't exist, create it
        create: true,
        overwrite: true,
        // Load only the local version of the database,
        // don't load the latest from the network yet
        localOnly: false,
        type: type,
        // If "Public" flag is set, allow anyone to write to the database,
        // otherwise only the creator of the database can write
        accessController: {
          write: publicAccess ? ['*'] : [orbitdb.identity.id],
        }
      })

      await load(db, 'Creating database...')
      // startWriter(db, interval)
    } catch (e) {
      console.error(e)
    }
    // openButton.disabled = false
    // createButton.disabled = false
  }

  const openDatabase = async (dbAddressField) => {
    const address = dbAddressField
    try {
      if(db) {
        await resetDatabase(db)
        statusElm.innerHTML = "Connecting to peers..."
        db = await obj.orbitdb.open(address, { sync: true })
        await load(db, 'Loading database...')
        writerText.innerHTML = `Listening for updates to the database...`
      } else {
        db = await obj.orbitdb.open(address, { sync: true })
        await load(db, 'Loading database...')
        writerText.innerHTML = `Listening for updates to the database...`
      }
    } catch (e) {
      console.error({
        _:"status error",
        data:e
      })
    }
    // startWriter(db,'5000')
  }

  const update = async (db) => {
    count ++

    const time = new Date().toISOString()
    const idx = Math.floor(Math.random() * creatures.length)
    const creature = creatures[idx]

    if (db.type === 'eventlog') {
      const value = "GrEEtinGs from " + orbitdb.id + " " + creature + ": Hello #" + count + " (" + time + ")"
      await db.add(value)
    } else if (db.type === 'feed') {
      const value = "GrEEtinGs from " + orbitdb.id + " " + creature + ": Hello #" + count + " (" + time + ")"
      await db.add(value)
    } else if (db.type === 'docstore') {
      const value = { _id: 'peer1', avatar: creature, updated: time }
      await db.put(value)
    } else if (db.type === 'keyvalue') {
      await db.set('mykey', creature)
    } else if (db.type === 'counter') {
      await db.inc(1)
    } else {
      throw new Error("Unknown datatbase type: ", db.type)
    }
  }

  const query = (db) => {
    if (db.type === 'eventlog')
      return db.iterator({ limit: 5 }).collect()
    else if (db.type === 'feed')
      return db.iterator({ limit: 5 }).collect()
    else if (db.type === 'docstore')
      return db.get('peer1')
    else if (db.type === 'keyvalue')
      return db.get('mykey')
    else if (db.type === 'counter')
      return db.value
    else
      throw new Error("Unknown datatbase type: ", db.type)
  }

  const queryAndRender = async (db) => {
    const networkPeers = await ipfs.swarm.peers()
    const databasePeers = await ipfs.pubsub.peers(db.address.toString())

    const result = query(db)

    if (dbType !== db.type || dbAddress !== db.address) {
      dbType = db.type;
      dbAddress = db.address;

      outputHeaderElm.innerHTML = `
        <h2>${dbType.toUpperCase()}</h2>
        <h3 id="remoteAddress">${dbAddress}</h3>
        <p>Copy this address and use the 'Open Remote Database' in another browser to replicate this database between peers.</p>
      `
    }

    outputElm.innerHTML = `
      <div><b>Peer ID:</b> ${orbitdb.id}</div>
      <div><b>Peers (database/network):</b> ${databasePeers.length} / ${networkPeers.length}</div>
      <div><b>Oplog Size:</b> ${Math.max(db._replicationStatus.progress, db._oplog.length)} / ${db._replicationStatus.max}</div>
      <h2>Results</h2>
      <div id="results">
        <div>
        ${result && Array.isArray(result) && result.length > 0 && db.type !== 'docstore' && db.type !== 'keyvalue'
      ? result.slice().reverse().map((e) => e.payload.value).join('<br>\n')
      : db.type === 'docstore'
        ? JSON.stringify(result, null, 2)
        : result ? result.toString().replace('"', '').replace('"', '') : result
    }
        </div>
      </div>
    `
  }
  openDatabase('/orbitdb/zdpuApCvxfEFug6uohbADwnsBvBBxSdHaq1WTD6ES8cKmxN14/web3')
  // createDatabase('orbit-of-venus')
  // openButton.addEventListener('click', openDatabase)
  // createButton.addEventListener('click', createDatabase)
  return obj

}