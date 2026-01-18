const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://gabizao:${password}@cluster0.ehfr2uh.mongodb.net/testBlog?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    title: "Test Blog1",
    author: "Gabriel Claudino de Souza",
    url: "https://www.gabriel.com",
    likes: 110
})

blog.save().then(result => {
    console.log('blog post saved!')
    mongoose.connection.close()
})