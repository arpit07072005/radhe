import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";




const registerUser = AsyncHandler(async (req ,res) =>{

const {fullName, email , username,password} = req.body

if(
    [fullName,email,username,password].some((field)=> field?.trim() === "")
){
    throw new ApiError(404,"please fill all entry")
}

const existedUser = await User.findOne({
    $or: [{ username }, { email }]
})

if(existedUser){
    throw new ApiError(409,"user or email exist")
}
const avatarLocalPath = req.files?.avatar[0]?.path;
if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
}
const avatar = await uploadOnCloudinary(avatarLocalPath)
if (!avatar) {
    throw new ApiError(400, "Avatar file is  not in cloudenary")
}
const user = await User.create({
    fullName,
    avatar: avatar.url,
    email, 
    password,
    username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
    "-password"
)

if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)
})

const loginUser = AsyncHandler(async  (req,res)=>{

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

    const loggedInUser = await User.findById(user._id).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser
            },
            "User logged In Successfully"
        )
    )


})



export {registerUser,loginUser}
