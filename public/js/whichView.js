const chooseView = async (user, db) => {

    
        const showOrToEeProfile = async () => {
            res.render("mentorToMentee", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: picture,
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
                }
            })
        }
        const showEeToOrProfile = async () => {
            res.render("menteeToMentor", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: picture,
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
                }
            })
        }
        const showEeToEeProfile = async () => {
            res.render("mentorToMentee", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: picture,
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
                }
            })
        }
        const showOrToOrProfile = async () => {
            res.render("menteeToMentor", {
                locals: {
                user: userProfile || {type:"N/A",username:"N/A"},
                picture: picture,
                chatlink: '<a href = /chat/' + userProfile.id + '>' + `Chat with ${userProfile.username}` + '</a>'
                }
            })
        }
}