// put this in models folder
const CRUD = require('./CRUD')


const User = (db)=>{
    const crud = CRUD(db, 'users');

    // const findById = async (id, show_reviews=true)=> {
    //     let user = await crud.findItemById(id);
    //     if(!show_reviews) return album;

    //     let reviews = await db.any(`SELECT reviews.*, albums.* from reviews JOIN albums ON reviews.album_id=albums.id WHERE reviews.user_id='${req.params.id}`)
    //     return {user,reviews}
    // }

    const findById = async (id)=> {
        let user = await crud.findItemById(id);
        return {user}
    }

    const confirmUser = async (username)=> {
        let user = await crud.findItembyUsername(username);
        // console.log(user)
        return (user ? true : false)
    }

    return {
        findAll:crud.findAllItems,
        findById,
        confirmUser,
        createNew:crud.createNewItem,
        remove:crud.deleteItem
    }
}

module.exports = User;