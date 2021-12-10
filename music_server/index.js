const PORT = 3000
const Koa = require('koa');
const cors = require('koa-cors')
const static = require('koa-static');
const koa_body = require("koa-body")
const router = require("./my_router/index")

var bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());
app.use(static(__dirname + '/static'));
app.use(cors());

app.use(koa_body({
    multipart: true,
    formidable: {
        maxFileSize: 1024 * 1024 * 2000
    }
}))
app.use(router.routes())

app.listen(PORT, () => {
    console.log("server run on " + PORT + ".....")
})









