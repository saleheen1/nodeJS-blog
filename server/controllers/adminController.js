
const adminLayout = '../views/layouts/admin_body_layout';
const User = require('../models/user');
const Post = require('../models/Post');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


/**
 * 
 * Middleware: Check if Logged in
*/
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

/**
go to Login Page
*/
const goToLoginPage = async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        res.render('admin/admin_login_page', { locals });
    } catch (error) {
        console.log(error);
    }
}


/**
  Login
*/
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'User doesn\'t exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
    }
}

/**
Register
*/
const register = async (req, res) => {
    try {
        const { username, password, about } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        try {
            const user = await User.create({ username, about: about, password: hashedPassword });
            res.status(201).json({ message: 'User Created', user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use' });
            }
            res.status(500).json({ message: 'Internal server error' })
        }

    } catch (error) {
        console.log(error);
    }
}


/**
Load Dashboard
*/
const loadDashboard = async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }

        const data = await Post.find();
        const userid = req.userId;
        const userData = await User.findById({ _id: userid });
        console.log(`user data ${userData}`);

        res.render('admin/admin_dashboard', {
            locals,
            data,
            userData,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }
}

/**
Add Post page
*/
const loadAddPostPage = async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }
        res.render('admin/add_post', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }
}

/**
create Post
*/
const createPost = async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        });

        await Post.create(newPost);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
}

/**
go to edit Post page
*/
const loadEditPostPage = async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };
        const data = await Post.findOne({ _id: req.params.id });
        res.render('admin/edit_post', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }
}

/**
edit a Post
*/
const editPost = async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/admin/dashboard`);

    } catch (error) {
        console.log(error);
    }
}

/**
delete a Post
*/
const deletePost = async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
}


/**
Load edit profile
*/
const loadEditProfilePage = async (req, res) => {
    try {
        const locals = {
            title: 'Edit profile',
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        }
        const userid = req.userId;
        const userData = await User.findById({ _id: userid });

        res.render('admin/edit_profile', {
            locals,
            userData,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }
}

/**
 edit profile
*/
const editProfile = async (req, res) => {
    try {
        const userid = req.userId;
        await User.findByIdAndUpdate(userid, { about: req.body.about });

        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
    }
}

/**
Logout
*/
const logOut = async (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/admin/login/page');

}

/**
 delete user
*/
const deleteUser = async (req, res) => {
    try {
        const userid = req.params.id;

        console.log(`user id ${userid}`);
        await User.findByIdAndDelete(userid);
        res.clearCookie('token');

        res.redirect('/admin/login/page');

    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    goToLoginPage,
    register,
    login, loadDashboard, authMiddleware,
    loadAddPostPage, createPost, loadEditPostPage,
    editPost, deletePost, logOut, loadEditProfilePage, editProfile, deleteUser
}