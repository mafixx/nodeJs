const express = require('express')
var router = express.Router()
const pg = require('pg')
const bcrypt = require('bcrypt')
const { Router } = require('express')


const strconexao = process.env.DATABASE_URL
const pool = new pg.Pool({connectionString: strconexao, ssl:{rejectUnauthorized:false}})


router.post('/',(req,res)=>{
    pool.connect((err,client,release)=>{
        if(err){
            return res.send({message:'Conexão não autorizada', erro: err.message})
        }
        bcrypt.hash(req.body.senha, 10, function(err, hash) {
            var sql = 'insert into usuario (nome,email,senha)values($1,$2,$3)'
            var dados = [req.body.nome, req.body.email, hash]
            client.query(sql,dados,function(error,result){
                return res.status(201).send({message: 'usuario inserido com sucesso'})
            })
            release()
        })
    })
    
})


router.post('/login',function(req,res){
    pool.connect(function(err,client, release){
        var sql = 'select * from usuario where email = $1'
        client.query(sql,[req.body.email],function(error,result){
            if(result.rowCount > 0){
                bcrypt.compare(req.body.senha,result.rows[0].senha, function(error,results){
                    if(results){
                        return res.send({message: 'autenticado'})
                    }else{
                        return res.send({message: 'erro de autenticação'})
                    }
                })
            }else{
                return res.send({message: 'usuario nao encontrado'})
            }
        })
    })
})

module.exports = router