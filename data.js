const fs = require('fs');
const crypto = require('crypto');

//EXTRACT DATA IN LIST BY KEYS IN PASED JSON OBJECT
function extract(list, json) {
    let newList = []
    list.forEach(el => {
        let obj = {}
        Object.keys(json).forEach(k => {
            obj[k] = el[k];
        })
        newList.push(obj)
    })
    return newList;
}

//CLASSES
class User {
    constructor(_id, username, password, events = []) {
        this._id = _id;
        this.username = username.trim();
        this.password = crypto.createHash('sha1').update(password).digest('hex');
        this.events = events;
    }

}
class EventClass {
    constructor(title, date, description) {
        this.title = title;
        this.date = date;
        this.description = description;
    }
}

//SAVE DATA
function save(path, data){
    fs.writeFileSync(path, data, function (err) {
        if (err) throw err;
    });
}
exports.FakeData = {
    //GET ALL ITEMS OF FAKE DATA, AND ALSO CAN EXTRACT CERTAIN ATTRIBUTES
    getAll: (path, extractJson = null) => {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path,
                { encoding: 'utf8', flag: 'r' });
            let list = data.trim().length < 1 ? [] : JSON.parse(data)
            return extractJson != null ? extract(list, extractJson) : list;
        }
    },
    //GET ITEM OF FAKE DATA, AND ALSO CAN EXTRACT CERTAIN ATTRIBUTES
    getItem: (path, json, extractJson = null) => {
        let list = this.FakeData.getAll(path);
        for (let el of list) {
            let found = true;
            for (const key in json) {
                if (el[key] != json[key]) {
                    found = false;
                    break;
                }
            }
            //IF ITEM IS FOUND, STOPS SEARCHING AND RETURNS CERTAIN ITEM
            if (found) {
                if (extractJson == null)
                    return el;
                else {
                    return extract([el], extractJson)[0]
                }
            }
        }
        return null;
    },
    //INSERTING NEW USER
    insertUser: (path, json) => {
        let list = this.FakeData.getAll(path);
        //GETTING UNIQUE ID
        let _id = list.length < 1 ? 0 : Math.max(...list.map(el => el['_id'])) + 1
        let object = new User(_id, json.username, json.password)
        list.push(object);
        save(path, JSON.stringify(list))
    },
    //INSERTING NEW EVENT
    insertEvent: (path, json) => {
        let list = this.FakeData.getAll(path);
        let index = list.findIndex(el => el._id == json._id && el.username == json.username)
        let object = new EventClass(json.title, json.date, json.description)
        list[index].events.push(object)
        save(path, JSON.stringify(list))
    },
    //UPDATE EVENT
    updateEvent: (path, json)=>{
        let list = this.FakeData.getAll(path);
        let index = list.findIndex(el => el._id == json._id && el.username == json.username)
        let eventIndex=list[index].events.findIndex(el=> el.date==json.date)
        list[index].events[eventIndex]=extract([json],{title: "", date: "", description: ""})[0];
        save(path, JSON.stringify(list))
    },
    //DELETE EVENT
    deleteEvent: (path, json)=>{
        let list = this.FakeData.getAll(path);
        let index = list.findIndex(el => el._id == json._id && el.username == json.username)
        let eventIndex=list[index].events.findIndex(el=>el.title==json.title && el.date==json.date)
        list[index].events.splice(eventIndex,1)
        save(path, JSON.stringify(list))
    }
}