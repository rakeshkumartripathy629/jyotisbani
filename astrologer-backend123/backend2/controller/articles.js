const conn = require('../database/config');

// const express = require('express');
// const mysql = require('mysql');
// const app = express();

// ----------------------------------------------------------Handle article submission------------------------------------------//


// Parse JSON and URL-encoded bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// Handle article submission
const submit = (req, res) => {
    const { title, description } = req.body;
    const insertQuery = 'INSERT INTO articles (title, description) VALUES (?, ?)';
    const countQuery = 'SELECT COUNT(*) AS count FROM articles';
    const descriptionLength = 150;
    if(description.length<=descriptionLength){
      conn.query(insertQuery, [title, description], (error) => {
        if (error) {
          throw error;
        }
    
        // Get the count of submitted articles
        conn.query(countQuery, (error, results) => {
          if (error) {
            throw error;
          }
    
          const count = results[0].count;
          res.status(200).json( {count} );
        });
      });
    }else{
      res.status(400).json({message:`description should be less than ${descriptionLength}`})
    }
  
   
  };

  const getTilteDescription = (req,res)=>{
    const selectQuery = 'SELECT title, description FROM articles';

  conn.query(selectQuery, (error, results) => {
    if (error) {
      throw error;
    }

    // const articles = results.map((row) => ({
    //   title: row.title,
    //   description: row.description,
    // }));

    res.status(200).json(results);
  });
  }
  const updateTilteDescription =(req,res)=>{
    const {id}= req.body

    const {title,description} = req.body;
    const descriptionLength= 150
    if(description.length<=descriptionLength){
      const updateQuery = "update articles set title =? , description =? where id=?";
    conn.query(updateQuery,[title,description,id],(error,result)=>{
      if(error) throw error
      console.log(result)
      res.send("article update is successful")
    })
    }else{
      res.status(400).json({message:`description should be less than ${descriptionLength}`})
    }
    
  }
  
  // Set up your routes and middleware here
// app.use(express.urlencoded({ extended: true })); 

//-------------------------------------------------------------Draft---------------------------------------------------------------//
const saveDraft = (req,res)=>{
  const {title,description} = req.body;
  const insertQuery = "INSERT INTO articles (title, description) VALUES (?, ?)";
const countQuery = "SELECT COUNT(*) AS count FROM articles";
const descriptionLength = 150;
if (description.length <= descriptionLength) {
  conn.query(insertQuery, [title, description], (error) => {
    if (error) {
      throw error;
    }
    conn.query(countQuery, (error, results) => {
      if (error) {
        throw error;
      }
      const count = results[0].count;
      res.status(200).json({ count });
    });
  });
}else{
  res.status(400).json({error:`description should be less than ${descriptionLength}`})
}

}

const deleteDraft = (req,res)=>{
  const {id} = req.body;
  const deleteQuery = "update articles set status='inactive' where id=?";
const countQuery = "SELECT COUNT(*) AS count FROM articles where status='active'";
conn.query(deleteQuery,[id],(error,result)=>{
  if(error) throw error
  conn.query(countQuery,(error,result)=>{
      if (error) {
          throw error;
        }
        const count = result[0].count;
        res.status(200).json({ count });
  })
})
}

const updateDraft = (req,res)=>{
  const {title,description} = req.body;
  const {id} = req.body;
  const updateQuery = "update articles set title=?, description=?  where id=?";
const descriptionLength = 150;
if (description.length <= descriptionLength) {
  conn.query(updateQuery, [title, description,id], (error) => {
    if (error) {
      throw error;
    }
    res.status(200).json({message:"draft updated successfullly"})
  });
}else{
  res.status(400).json({message:`description should be less than ${descriptionLength}`})
}


//----------------------------------------------------------------------post----------------------------------------------------------//
const post = (req, res) => {
  const { title, description } = req.body;
  const insertQuery = "INSERT INTO articles (title, description) VALUES (?, ?)";
  const countQuery = "SELECT COUNT(*) AS count FROM articles";
  const descriptionLength = 150;
  
  if (description.length <= descriptionLength) {
    conn.query(insertQuery, [title, description], (error) => {
      if (error) {
        throw error;
      }
      conn.query(countQuery, (error, results) => {
        if (error) {
          throw error;
        }
        const count = results[0].count;
        res.status(200).json({ count });
      });
    });
  } else {
    res.status(400).json({ error: `Description should be less than ${descriptionLength}` });
  }
};


}
  module.exports={
    submit,getTilteDescription,updateTilteDescription,saveDraft, updateDraft,deleteDraft
  }
  

