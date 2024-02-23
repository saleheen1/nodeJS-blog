const axios = require('axios');
const Post = require('../models/Post');
const { subscribe } = require('../routes/blogRoutes');


// const fetchPosts = async (req, res) => {
//     try {
//         const locals = {
//             title: "NodeJs Blog",
//             description: "Simple Blog created with NodeJs, Express & MongoDb."
//         }

//         let perPage = 10;
//         let page = req.query.page || 1;

//         const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
//             .skip(perPage * page - perPage)
//             .limit(perPage)
//             .exec();

//         const count = await Post.countDocuments({});
//         const nextPage = parseInt(page) + 1;
//         const hasNextPage = nextPage <= Math.ceil(count / perPage);

//         res.render('index', {
//             locals,
//             data,
//             current: page,
//             nextPage: hasNextPage ? nextPage : null,
//             currentRoute: '/'
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }


const fetchPosts = async (req, res) => {
    const locals = { title: "Home", desc: "lorem ipsum" }

    try {
        const data = await Post.find();
        res.render('index', { locals, data });
    } catch (error) {
        console.log(error);
    }
}

const fetchSinglePost = async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
        }
        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }
}


const searchPost = async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });

        console.log(`datas are ${data}`)

        res.render("search_page", {
            data,
            locals,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }
}




const about = (req, res) => {
    const data = { title: "About", desc: "lorem ipsum" }
    res.render('about', { data })
}


// mailchimp
const saveEmailForNewsLetter = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    // const jsonData = JSON.stringify(data);
    const apiUrl = process.env.MAILCHIMP_URI;
    const headers = {
        Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`
    }
    axios.post(apiUrl, data, {
        headers: headers
    })
        .then(apiResponse => {
            res.send("Newsletter signup success")
        })
        .catch(err => {
            console.log(err);
        });
}


module.exports = {
    fetchPosts, about, fetchSinglePost, searchPost,
    saveEmailForNewsLetter
}