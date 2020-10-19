const Adm = require('../models/Adm');
const bcrypt = require('bcrypt');
const Produto = require('../models/Products')
module.exports = {
    async adm(req, res) {
        try {
            const { name, phone, email, password, street, numberHouse } = req.body;
            if (!name || !phone || !email || !password || !street || !numberHouse){
                return res.status(400).json('Campo em branco')
            }
            if(phone.length > 15 || phone.length <=7){
                return res.status(400).json('Telefone inválido')
            }
            if(await Adm.findOne({ name })){
                return res.status(400).json('Este nome já está sendo usado')
             }
            if(await Adm.findOne({ email })){
               return res.status(400).json('Este e-mail já está sendo usado')
            }


            req.body.password = await bcrypt.hash(password, 12)
            req.body.name = name.toLowerCase()
            req.body.mediaEvaluation = 0
            const adm = await Adm.create( req.body );

            return res.status(200).json(adm);
        } catch (error) {
            console.log(error)
            return res.status(500).json('Falha no registro');
        }
    },
    async findOne(req,res){
        try {
            const { name } = req.body;
            const brecho = await Adm.findOne({ name: name.toLowerCase() })
            if( !brecho ){
                return res.status(404).json('Brecho não encontrado')
            }
            return res.status(200).json(brecho)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Falha');
        }
    },
    async updateAdm(req, res){
        try {
            const { name, phone, email, password, street, numberHouse, imageLocation } = req.body;
            if (!name || !phone || !email || !password || !street || !numberHouse){
                return res.status(400).json('Campo inválido')
            }
            if(phone.length > 15 || phone.length <=7){
                return res.status(400).json('Telefone inválido')
            }           
            req.body.password = await bcrypt.hash(password, 12)
            
            console.log(req.file)
            if(!req.file){
                return res.status(400).json('Imagem não cadastrada')
                
            }

            const { originalname, size : sizeImg, key, location } = req.file
            const image = {
                originalName: originalname,
                size: sizeImg,
                key,
                location
            }

            const alter = {
                name: name.toLowerCase(), 
                phone,
                email, 
                password: req.body.password,
                street, 
                numberHouse
            }
            if( imageLocation == "perfil"){
                alter.image = image                
            }
            if( imageLocation == "banner"){
                alter.imageBanner = image
            }
            const adm = await Adm.findByIdAndUpdate(req.userId, alter, { new: true });
            // console.log(phone)
            return res.status(200).json(adm);
            
        } catch (error) {
            return res.status(500).json('Falha ao atualizar');
        }
    },
    async ListAdm(req, res){ 
        try {
            const adms = await Adm.find()
            return res.status(200).send({ adms })
        } catch (error) {
            console.log(error)
            return res.status(500).json('Falha ao listar');
        }
    },
    async DeleteAdm(req,res){
        try {
            const id = req.userId;
            await Produto.findOneAndDelete({ adm: id })
            await Adm.findByIdAndDelete( id ) 
            return res.status(200).json('Deletado com sucesso')
        } catch (error) {
            console.log(error)
            return res.status(500).json('Falha ao deletar');
        }
    },
    async Evaluation(req, res){
        try {
            const adm = await Adm.findById( req.params.id )
            const { avaliate, comment } = req.body
            adm.evaluation.push({
                adm: req.params.id,
                avaliate,
                comment
            })
            let mediaEvaluation = 0
            for( const evaluation of adm.evaluation ){
                console.log(adm.evaluation)
                
                mediaEvaluation = mediaEvaluation + evaluation.avaliate
            }
            adm.mediaEvaluation = mediaEvaluation / adm.evaluation.length
            console.log(adm.mediaEvaluation)
            await adm.save()            
            const admAvaliated = await Adm.findById( req.params.id )
            return res.status(200).json( admAvaliated )

        } catch (error) {
            return res.status(500).json('Falha ao avaliar');
        }
    }
}