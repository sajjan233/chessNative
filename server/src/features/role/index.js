import Role from "./role.js";

const roleController = {};

roleController.create = async (req,res) => {
    let response = {
        message : '',
        status : 0
    }
    try {
        console.log(req.body);
    
        let data = {
            role : req.body.role,
            slug : req.body.role.trim().toLowerCase()
        }

        let resp = await Role.create(data)
        response.data = resp
        response.status = 1
        return res.json(response)
    } catch (err) {
        console.log(err);
        response.message = err.message
        return res.json(response)
        
    }
}

export default roleController;