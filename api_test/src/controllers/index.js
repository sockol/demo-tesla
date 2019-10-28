
const { resolve } = require(`path`);
const redisClient = require(resolve('./src/lib/Redis'));
const uuid = require(`uuid/v4`);

const getRandomColor = () => parseInt(`0x${Math.floor(Math.random()*16777215).toString(16)}`)

module.exports.getTeslas = async (req, res) => {

    const keys = await redisClient.keysAsync('*')
    const teslas = await Promise.all(keys.map(async k => {
        const d = await redisClient.getAsync(k)
        return JSON.parse(d)
    }))
    res.send(teslas)
};

module.exports.teslaInputValidator = async (req, res, next) => {

    const { title, latitude, longitude } = req.body
    const error = latitude < 0 || latitude > 1 ? `Latitude needs to be within 0-1` : 
        longitude < 0 || longitude > 1 ? `Longitude needs to be within 0-1` :
        !title ? `Title cannot be empty` : 
        null

    if(error)
        return res.status(422).json({ error })
    next()
}

module.exports.addTesla = async (req, res, next) => {

    try{
        const id = uuid()
        const color = getRandomColor()
        const tesla = {
            ...req.body,
            color,
            id,
        }

        const data = JSON.stringify(tesla)
        await redisClient.setAsync(id, data)
        res.json(tesla)

        redisClient.publish(`ADD`, data)
        
    }catch(error){

        res.status(500).json({ error })
    }
}

module.exports.updateTesla = async (req, res) => {
    
    try{

        const { id } = req.params
        const tesla = {
            ...req.body,
            id,
        }

        const data = JSON.stringify(tesla)
        await redisClient.setAsync(id, data)
        res.json(tesla)

        console.log('PUBLISH EVENT update')
        redisClient.publish(`UPDATE`, data)

    }catch(error){

        res.status(500).json({ error })
    }
}

module.exports.removeTesla = async (req, res) => {
    
    try{

        const { id } = req.params
        const tesla = { id }
        const data = JSON.stringify(tesla)
        await redisClient.delAsync(req.params.id)
        res.json(tesla)
        
        redisClient.publish(`REMOVE`, data)

    }catch(error){
        
        res.status(500).json({ error })
    }
}
