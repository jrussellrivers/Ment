
const CRUD = (db, table)=>{
    const findAllItems = async ()=> await db.any(`SELECT * FROM ${table}`);

    const findItemById = async (id)=>  await db.one(`SELECT * FROM ${table} WHERE id='${id}'`);

    const findItembyUsername = async (username)=> await db.one(`SELECT * FROM ${table} WHERE username='${username}'`);

    const createNewItem = async (optValues)=>await db.one(`
        INSERT INTO 
        ${table} 
        (${Object.keys(optValues).join(", ")}) 
            VALUES 
        ('${Object.values(optValues).join("','")}') RETURNING *
        `);

    const deleteItem = async (id)=> await db.one(`REMOVE FROM ${table} WHERE id='${id}' RETURNING ${id}`);

    return {findAllItems, findItemById, findItembyUsername, createNewItem, deleteItem}
}

module.exports = CRUD