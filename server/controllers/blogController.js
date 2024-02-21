

const blogHome = (req, res) => {
    const data = { title: "Home", desc: "lorem ipsum" }
    res.render('', { data })
}

const about = (req, res) => {
    const data = { title: "About", desc: "lorem ipsum" }
    res.render('about', { data })
}


module.exports = {
    blogHome, about
}