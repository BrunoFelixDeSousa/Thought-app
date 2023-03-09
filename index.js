const express = require('express')                      // Importar o módulo do Express
const { create } = require('express-handlebars')        // Importar a função create do módulo Express Handlebars para criar uma instância do Handlebars
const session = require('express-session')              // Importar o módulo Express Session para lidar com sessões de usuário
const FileStore = require('session-file-store')(session)// Importar o módulo Session File Store para armazenar sessões em arquivos
const flash = require('express-flash')                  // Importar o módulo Express Flash para exibir mensagens flash para o usuário

// Criar o app do Express
const app = express()

// Importar e estabelecer conexão com o banco de dados
const conn = require('./db/conn')

// chamando os models
const Thought = require('./models/Thought')
const User = require('./models/User')

// Import Routs
const thoughtRoute = require('./routes/ThoughtRoute')
const authRouter = require('./routes/AuthRoute')

// Import controller
const ThoughtController = require('./controllers/ThoughtController')

// Configurar o Handlebars como mecanismo de visualização, especificando um diretório de partials
const handlebars = create( {partialsDir:['views/partials']})
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

// Definir o diretório estático para arquivos públicos
app.use(express.static('public'))

// Habilitar o parsing de requisições JSON e de formulários
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Configurar a sessão
app.use(
    session({
        // Nome do cookie
        name: "session",
        // Segredo para assinar o cookie da sessão
        secret: "nosso-secret",
        // Não salvar a sessão se ela não for modificada
        resave: false,
        // Não criar uma sessão nova sem conteúdo
        saveUninitialized: false,
        // Especificar o armazenamento das sessões em arquivos
        store: new FileStore({
            logFn: function () {},
            // Especificar o diretório de armazenamento das sessões
            path: require('path').join(require('os').tmpdir(), 'session'),
        }),
        // Configurar o cookie da sessão
        cookie: {
            // Cookie seguro (HTTPS) ou não seguro (HTTP)
            secure: false,
            // Tempo de vida do cookie em milissegundos
            maxAge: 3600000,
            // Data de expiração do cookie
            expires: new Date(Date.now() + 3600000),
            // Somente acessível via HTTP (não via JavaScript)
            httpOnly: true
        }
    }),
)

// Configurar o middleware para exibir mensagens flash para o usuário
app.use(flash())

// Configurar o middleware para verificar se o usuário está logado e definir a variável local "session"

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }
    next()
})

// Rotas
app.use('/thoughts', thoughtRoute)
app.use('/', authRouter)

app.get('/', ThoughtController.showThoughts)

// Sincronizar o banco de dados e iniciar o servidor Express
conn.sync(/*{force:true}*/).then(() => {
    app.listen(process.env.PORT || 3000)
}).catch((err) => console.log(err))