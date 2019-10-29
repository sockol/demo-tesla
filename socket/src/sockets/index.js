
const { resolve } = require(`path`);
const uuid = require(`uuid/v4`);
const redisClient = require(resolve('./src/lib/Redis'));

const fetch = require('isomorphic-unfetch')

const extendedFetch = (url, params) => {
  
  return fetch(url, params)
    .then(res => new Promise((resolve, reject) => {
      if(res.ok) 
        return resolve(res.json())
      res.json().then(d => reject(d.error))
    }))
}

const getRandomColor = () => parseInt(`0x${Math.floor(Math.random()*16777215).toString(16)}`)

class TeslaTracker {
    constructor(){
        this.emitBegan = false
        this.list = []


        this.fakeColorChange = this.fakeColorChange.bind(this)
        this.initConnection = this.initConnection.bind(this)

        this.id = Math.random()
        extendedFetch(`${process.env.API_URI_INTERNAL}/api/teslas`)
            .then(data => this.list.push(...data))
    }
    
    fakeColorChange(socket){ 
        
        setInterval(() => {
            for(let i = 0; i < this.list.length; i++) 
                this.list[i].color =getRandomColor() 
                
            socket.broadcast.emit('COLOR_CHANGE', this.list)
        }, 500)
    }

    handleCRUD(socket){

        redisClient.on('message', (channel, message) => {
            const tesla = JSON.parse(message)
            
            if(channel === `ADD`){
                socket.broadcast.emit('ADD', message)
                this.list.push({
                    id: tesla.id,
                    color: tesla.color,
                })
            }else if(channel === `UPDATE`){
                socket.broadcast.emit('UPDATE', message)
                const index = this.list.findIndex(i => i.id === tesla.id)
                this.list.splice(index, 1)
                this.list.push(tesla)
            }else if(channel === `REMOVE`){
                socket.broadcast.emit('REMOVE', message)
                const index = this.list.findIndex(i => i.id === tesla.id)
                this.list.splice(index, 1)
            }
        });

        redisClient.subscribe('ADD');
        redisClient.subscribe('UPDATE');
        redisClient.subscribe('REMOVE');
    }

    async initConnection(socket){
        if(this.emitBegan)
            return 

        this.emitBegan = true
        
        this.fakeColorChange(socket)
        
        this.handleCRUD(socket)
    }
}
module.exports = new TeslaTracker()