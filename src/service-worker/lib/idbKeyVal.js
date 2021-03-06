let idb = require('idb')

class IdbKeyVal {
  constructor () {
    this.dbPromise = idb.openDb('keyval-store', 1, upgradeDB => {
      upgradeDB.createObjectStore('keyval')
    })
  }

  async get (key) {
    const db = await this.dbPromise
    return db.transaction('keyval').objectStore('keyval').get(key)
  }
  async set (key, val) {
    const db = await this.dbPromise
    const tx = db.transaction('keyval', 'readwrite')
    tx.objectStore('keyval').put(val, key)
    return tx.complete
  }
  async delete (key) {
    const db = await this.dbPromise
    const tx = db.transaction('keyval', 'readwrite')
    tx.objectStore('keyval').delete(key)
    return tx.complete
  }
  async clear () {
    const db = await this.dbPromise
    const tx = db.transaction('keyval', 'readwrite')
    tx.objectStore('keyval').clear()
    return tx.complete
  }
  async keys () {
    const db = await this.dbPromise
    return db.transaction('keyval').objectStore('keyval').getAllKeys()
  }
}

module.exports.IdbKeyVal = IdbKeyVal
