const renderSkills = async (user_id, db) => {
    const SKILLCOUNT = 6
    const skills = ["product_management", "design", "machine_learning", "data_science", "software_engineering", "web_development"]

    const checkVal = async (skill, user_id) => {
        let result = await db.one(`SELECT ${skill} FROM skills WHERE id='${user_id}'`)
        return Object.values(result)
    }
    

    let cards = `
    <div class = "skills-container"> `
    for (i=0;i<SKILLCOUNT;i++) {
        let skill_name = skills[i].split("_").join(" ")
        let skillStatus =  await checkVal(skills[i], user_id)
        cards = cards + `<div class = "skill-tag ${skillStatus}">${skill_name}</div>`
    }
    cards = cards + `</div>`
    return cards
}
module.exports = renderSkills