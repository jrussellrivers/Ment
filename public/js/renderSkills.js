const renderSkills = async (user_id, db) => {
    const SKILLCOUNT = 6
    const skills = ["pm", "creative", "ml", "datascience", "softwareengineering", "webdev"]

    const checkVal = async (skill, user_id) => {
        let result = await db.one(`SELECT ${skill} FROM skills WHERE id='${user_id}'`)
        return Object.values(result)
    }
    

    let cards = `This is where the skills cards will go...
    <div class = "skills-container"> `
    for (i=0;i<SKILLCOUNT;i++) {
        let skillStatus =  await checkVal(skills[i], user_id)
        cards = cards + `<div class = "skill-tag ${skillStatus}">${skills[i]}</div>`
    }
    cards = cards + `</div>`
    return cards
}

module.exports = renderSkills