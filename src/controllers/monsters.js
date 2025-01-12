const { fetchSingleResult, fetchMultipleResults } = require("../utils/request");
const connection = require("../database.js");


function getAll(req, res){
    stm = "SELECT * FROM monsters"
    params = []
    fetchMultipleResults(stm, params, res)
}

function get(req, res){
    stm = "SELECT * FROM monsters WHERE id = ?"
    const id = req.params['id']
    params = [id]
    fetchSingleResult(stm, params, res)
}


function add(req, res) {
    const { name, image, type, hp, figureCaption, attackName, attackStrength, attackDescription } = req.body;
    const params = [name, image, type, hp, figureCaption, attackName, attackStrength, attackDescription];
    const stm = "INSERT INTO monsters (name, image, type, hp, figureCaption, attackName, attackStrength, attackDescription) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  
    connection.query(stm, params, (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Failed to insert monster" });
      }
  
      const insertedMonsterId = results.insertId;
  
      const getMonsterStm = "SELECT * FROM monsters WHERE id = ?";
      connection.query(getMonsterStm, [insertedMonsterId], (error, result) => {
        if (error) {
          return res.status(500).json({ error });
        }
  
        if (result.length === 0) {
          return res.status(404).json({ message: "Monster not found after insertion" });
        }
        return res.status(200).json(result[0]);
      });
    });
  }


  function update(req, res) {
    const {name, image, type, hp, figureCaption, attackName, attackStrength, attackDescription } = req.body;
    const id = req.params['id']
    let updateFields = [];
    let params = [];

    if (name) {
        updateFields.push('name=?');
        params.push(name);
    }
    if (image) {
        updateFields.push('image=?');
        params.push(image);
    }
    if (type) {
        updateFields.push('type=?');
        params.push(type);
    }
    if (hp) {
        updateFields.push('hp=?');
        params.push(hp);
    }
    if (figureCaption) {
        updateFields.push('figureCaption=?');
        params.push(figureCaption);
    }
    if (attackName) {
        updateFields.push('attackName=?');
        params.push(attackName);
    }
    if (attackStrength) {
        updateFields.push('attackStrength=?');
        params.push(attackStrength);
    }
    if (attackDescription) {
        updateFields.push('attackDescription=?');
        params.push(attackDescription);
    }
    params.push(id);

    const stm = `UPDATE monsters SET ${updateFields.join(', ')} WHERE id=?`;

    connection.query(stm, params, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Failed to update monster" });
        }

        const updatedMonsterId = id;

        const getMonsterStm = "SELECT * FROM monsters WHERE id = ?";
        connection.query(getMonsterStm, [updatedMonsterId], (error, result) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: "Monster not found after update" });
            }
            return res.status(200).json(result[0]);
        });
    });
}


function remove(req, res) {
    const stm = "DELETE FROM monsters WHERE id = ?";
    const params = [req.params.id];

    connection.query(stm, params, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Monster not found" });
        }
        return res.status(200).json({ message: "Monster deleted successfully" });
    });
}


module.exports = {getAll, get, add, update, remove};
