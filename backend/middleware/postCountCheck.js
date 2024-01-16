const { UserModel } = require("../models/user.model");

const checkPostingLimit = async (req, res, next) => {
    const { email } = req.body;
    try {
        let user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const membership = user.membership;

        let postingLimit;
        switch (membership) {
            case 'Silver':
                postingLimit = 5;
                break;
            case 'Gold':
                postingLimit = Infinity;
                break;
            default:
                postingLimit = 1;
                break;
        }

        // Checking if the user has reached the posting limit
        const userPosts = user.postsCount || 0;
        if (userPosts >= postingLimit) {
            return res.status(403).json({ message: 'Posting limit exceeded' });
        }

        // If not, add one to posts count and save the user
        user.postsCount = userPosts + 1;
        console.log(user.postsCount)
        await user.save();

        next();
    } catch (error) {
        console.error('Error checking posting limit:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { checkPostingLimit };
