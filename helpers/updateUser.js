const { db } = require('../models/user');
function updateUser(userId, name, email) 
{
    if (name) {
        db.collection('users').updateOne(
            { "_id": userId}, // Filter
            {$set: {"name" : name}} // Update
        );
    }
    
    if (email) {
        db.collection('users').updateOne(
            { "_id": userId}, // Filter
            {$set: {"email" : email}} // Update
        );
    }
}

function deleteUser(userId) 
{
    db.collection('users').deleteOne(
        {"_id": userId}
    )
}

exports.updateUser = updateUser;
exports.deleteUser = deleteUser;