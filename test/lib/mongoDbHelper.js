let MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017/mtc' // will need to be changed to ENV variable for other connections

module.exports = {
  Settings: function () {
    return MongoClient.connect(url).then(function (db) {
      let collection = db.collection('settings')
      return collection.find().toArray()
    }).then(function (items) {
      return items
    })
  },
  SettingsLogs: function () {
    return MongoClient.connect(url).then(function (db) {
      let collection = db.collection('settinglogs')
      return collection.find().sort({datefield: 1}).toArray()
      // date is a JavaScript Date object.
    }).then(function (items) {
      return items
    })
  },
  SetExpirePin: function (forName, lastName, schoolId, flag = false) {
    MongoClient.connect(url).then(function (db) {
      let collection = db.collection('pupils')
      collection.updateOne({
        'foreName': forName,
        'lastName': lastName,
        'school': schoolId
      }, {$set: {'pinExpired': flag}})
    }, function (err) {
      if (err) {
        throw err
      }
    })
  },
  ResetPin: function (forName, lastName, schoolId, pin = undefined) {
    MongoClient.connect(url).then(function (db) {
      let collection = db.collection('pupils')
      collection.updateOne({
        'foreName': forName,
        'lastName': lastName,
        'school': schoolId
      }, {$set: {'pin': pin}})
    }, function (err) {
      if (err) {
        throw err
      }
    })
  }
}
