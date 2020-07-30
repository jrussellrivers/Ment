formidable = require('formidable')

const uploadImage = async (req, db) => {
    let form = {};
    new formidable.IncomingForm()
    .parse(req)
    .on("field", (name, field) => {
    form[name] = field;
    })
    .on("fileBegin", (name, file) => {
    //sets the path to save the image
    
    file.path =
        __dirname + '..'
        "/profile_images/" +
        new Date().getTime() +
        file.name;
    })
    .on("file", (name, file) => {
    //console.log('Uploaded file', name, file);
    form.profile_image = file.path.replace(__dirname + "/public", "");
    })

    .on ("end", async () => {
    console.log("your photo is uploaded!");
    
//     //Now i can save the form to the database
    let newimageaddress= '<img src="' + form.profile_image + '" alt="profile pic">'
    let results = await db.none("insert into images (user_id, imgname) values ($1, $2)", [req.user.id, newimageaddress])

    })
}

module.exports = uploadImage
