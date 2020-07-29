let file = "";

const loadFile = (evt)=>{
    console.log(evt.target.files[0]);
    let FR = new FileReader()
    FR.onload = (e)=>{
        document.getElementById("image-to-Upload").innerHTML = `<img src='${e.target.result}' />`
    }
    FR.readAsDataURL(evt.target.files[0]);
    file = evt.target.files[0];
    document.getElementById("submit").classList.remove("hidden")
}

const uploadToServer = (evt) =>{
        //best to commit it as such
        const formData = new FormData();
        formData.append('upload', file);

        //not nessessay if you are just uploading a single image
        formData.append('user_id','value_from_another_form_item' )//etc
        formData.append('Some_other_DB_filed','AnotherValue' )//etc

        console.log(formData);
        fetch('/image-uploaded', {
            method:'POST',
            body:formData
        })
        .then(resp=>resp.json())
        .then(data=>console.log(data))
        .catch(err=>console.log(error))
    
}

document.getElementById("upload").addEventListener("input", loadFile);//Whenever you change the image
document.getElementById("submit").addEventListener("click", uploadToServer);//when you hit the submit button