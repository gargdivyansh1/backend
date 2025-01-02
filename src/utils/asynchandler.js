// lets do it with the use of promised 
// resolve reject or the resolve catch could also work
const asynchandler = (requesthandler) => {
    return (req,res,next) => {
        Promise.resolve(requesthandler(req,res,next)).catch((error) => next(error))
    }
}

export {asynchandler}


// this is where we are doing with the try catch syntax 

// these are higher order functions 
// these can accept the fucctyion and also can pass it as response
// const asynchandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }