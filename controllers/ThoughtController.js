const Thought = require('../models/Thought')
const User = require('../models/User')

const {Op} = require('sequelize')

module.exports = class ToughtController {

    static async showThoughts(req, res) {

        let search = ''

        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        if (req.session.userid) {
            const thoughtData = await Thought.findAll({
                include: User,
                where: {
                    title: {[Op.like]: `%${search}%`}
                },
                order: [['createdAt', order]]
            })
            const thoughts = thoughtData.map((result) => result.get({plain: true}))
            const user = await User.findOne({where: {id: req.session.userid}})
            const userfilter = user.dataValues

            let thoughtQty = thoughts.length

            if (thoughtQty === 0) {
                thoughtQty = false
            }

            res.render('thoughts/home', {userfilter, thoughts, search, thoughtQty})
            return; // adicionado return aqui para interromper a execução do método
        }

        res.render('thoughts/home')
    }

    static async dashboard(req, res) {
        const userId = req.session.userid

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: Thought,
            plain: true
        })

        if (!user) {
            res.redirect('/login')
        }

        const thoughts = user.thoughts.map((result) => result.dataValues)
        const userfilter = user.dataValues

        let emptyThought = false

        if (thoughts.length === 0) {
            emptyThought = true
        }

        res.render('thoughts/dashboard', {thoughts, userfilter, emptyThought})
    }

    static async createThought(req, res) {

        const user = await User.findOne({where: {id: req.session.userid}})
        const userfilter = user.dataValues

        res.render('thoughts/create', {userfilter})
    }

    static async createThoughtSave(req, res) {

        const thought = {
            title: req.body.title,
            userId: req.session.userid
        }

        try {
            await Thought.create(thought)

            req.flash('message', 'Pensamento criado com sucesso')

            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (err) {
            console.log(err)
        }
    }

    static async updateThought(req, res) {

        const id = req.params.id

        const user = await User.findOne({where: {id: req.session.userid}})
        const userfilter = user.dataValues

        const thought = await Thought.findOne({where: {id: id}, raw: true})

        res.render('thoughts/edit', {thought, userfilter})
    }

    static async updateThoughtPost(req, res) {

        const thought = {
            title: req.body.title,
        }

        try {
            await Thought.update(thought, {where: {id: req.body.id}})
            req.flash('message', 'Pensamento atualizado com sucesso!')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (err) {
            console.log(err)
        }


    }

    static async thoughtDelete(req, res) {

        const id = req.body.id
        const userId = req.session.userid

        try {
            await Thought.destroy({
                where: {
                    id: id,
                    userId: userId
                }
            })
            req.flash('message', 'Pensamento removido com sucesso')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })

        } catch (err) {
            console.log(err)
        }
    }
}