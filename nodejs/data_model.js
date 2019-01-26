const fs = require('fs');
const underscore = require('underscore');

const dataJsonFilePath = '../data.json';
let commonDataJson = "";
if (fs.existsSync(dataJsonFilePath)) {
  commonDataJson = fs.readFileSync(dataJsonFilePath);
} else {
  // init
  commonDataJson = JSON.stringify({
    missions: [],
    users: [],
    messages: [],
  });
}

let commonData = JSON.parse(commonDataJson);

const DataModel = function () {
  return {
    findBy: function (key, args = {}) {
      const argKeys = Object.keys(args);
      return underscore.find(commonData[key], function (cell) {
        return argKeys.every(function (argKey) {
          return args[argKey] === cell[argKey];
        });
      });
    },
    findByAll: function (key, args = {}) {
      const argKeys = Object.keys(args);
      return underscore.filter(commonData[key], function (cell) {
        return argKeys.every(function (argKey) {
          return args[argKey] === cell[argKey];
        });
      });
    },
    update: function (key, filterArgs = {}, args = {}) {
      const updateObjects = commonData[key];
      console.log(commonData);
      const filterArgKeys = Object.keys(filterArgs);
      let result = {}
      for (let i = 0; i < updateObjects.length; ++i) {
        if (filterArgKeys.every(function (filterArgKey) {
            return filterArgs[filterArgKey] === updateObjects[i][filterArgKey];
          })) {
          updateObjects[i] = Object.assign(updateObjects[i], args);
          result = updateObjects[i];
          break;
        }
      }
      commonData[key] = updateObjects;
      this.saveFile();
      return result;
    },
    updateAll: function (key, filterArgs = {}, args = {}) {
      const updateObjects = commonData[key];
      const filterArgKeys = Object.keys(filterArgs);
      let count = 0;
      for (let i = 0; i < updateObjects.length; ++i) {
        if (filterArgKeys.every(function (filterArgKey) {
            return filterArgs[argKey] === updateObjects[i][filterArgKey];
          })) {
          updateObjects[i] = Object.assign(updateObjects[i], args);
          ++count;
        }
      }
      commonData[key] = updateObjects;
      this.saveFile();
      return count;
    },
    create: function (key, args = {}) {
      commonData[key].push(args);
      this.saveFile();
      return commonData[key];
    },
    saveFile: function () {
      fs.writeFileSync(dataJsonFilePath, JSON.stringify(commonData));
    },
  }
}

module.exports = DataModel;