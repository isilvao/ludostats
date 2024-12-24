const app = require('./app')
const {APP_NAME} = require('./constants')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`${APP_NAME} listening on port ${PORT}`)
})
