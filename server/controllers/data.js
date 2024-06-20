const {client} = require("../Connection");
const { ObjectId } = require("mongodb");

//get all the questions
const findAllQuestions = async(req,res)=>{
    console.log("findAllQuestions request")
    try {
        const database = client.db('noob');
        const collection = database.collection('ques');
        const questionsCursor = collection.find({});
        const questionsArray = await questionsCursor.toArray();
        return res.json(questionsArray);

      } catch (error) {
        console.log('Error ', error);
        return [];
      } 
}
//get request for find the qeustion by id
const findQuestionById = async(req,res)=>{
    try{
        const id = req.body;
        const database = client.db('noob');
        const collection = database.collection("ques");
        const questions =  collection.find({
            _id:id,
        })
        const questionsArray = await questions.toArray();
        return questionsArray;
    }catch{
        return [];
    }
}
//Addlikes end point
const Addlikes = async(req,res)=>{
    try{
        const {questionId,amount} = req.body;
        const database  =client.db('noob');
        const collection = database.collection('ques');
        
        await collection.findOneAndUpdate(
          {_id: questionId},
          {$inc:{"likes":amount}}
        )
        res.json({success:true});
      }catch(erorr){
        console.error('Error updating likes:', erorr);
        res.status(500).json({ error: 'Internal server error' });
      }
}
//Add dislike end point
const AddDislike = async(req,res)=>{
    try{
        const {questionId,amount} = req.body;
        const database  =client.db('noob');
        const collection = database.collection('ques');
        
        await collection.findOneAndUpdate(
          {_id: questionId},
          {$inc:{"dislikes":amount}}
        )
        res.json({success:true});
      }catch(erorr){
        console.error('Error updating likes:', erorr);
        res.status(500).json({ error: 'Internal server error' });
      }finally{
        await client.close();
      }
}

const getAllTestCases = async(req,res)=>{
  try{
    const id = req.params.id;
    const database = client.db("noob");
    const collection = database.collection("testcases");
    const data = await collection.findOne({
      questionId:id,
    });
    // console.log(data);
    return res.json(data);
  }
  catch(error){
    // console.error('Error updating likes:', erorr);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getExampleTestCases = async(req,res)=>{
  try{
    const id = req.params.id;
    const database = client.db("noob");
    const collection = database.collection("example_testcases");
    const data = await collection.findOne({
      questionId:id,
    });
    // console.log(data);
    return res.json(data);
  }
  catch(error){
    // console.error('Error updating likes:', erorr);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// endpoint to add posts in discuss
const addPost=async(req,res)=>{

  try {
    const {categoryTitle, postTitle, postContent} = req.body;
    const database = client.db('noob');
    const collection = database.collection('post');
    const category = collection.findOne({
      title: categoryTitle
    });

    if(category){
      const postId = new ObjectId();
      await collection.updateOne(
        { title: categoryTitle },
        { $push: { posts: {_id:postId, title: postTitle, content: postContent } }}
      )
        res.json({success:true});
    }else{
      console.error("Category not found");
    }


  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  } 
}

//endpoint to get posts

const getPost = async (req, res) => {
  try {
    const database = client.db("noob");
    const collection = database.collection('post');

    const postId = req.query.postId; // get the postId from the request query
    const selectedTab = req.query.selectedTab; // get the selectedTab from the request query
    let item;
    if(postId && selectedTab){
      let filter = {
        _id: new ObjectId(selectedTab)
      };

      let projection = {
        posts: {
          $elemMatch: {
            _id: new ObjectId(postId)
          }
        }
      };
      item = await collection.findOne(filter, { projection });
    }else {
      item = await collection.find({}).toArray();
    }

    // item = await collection.findOne(filter, { projection });
    return res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

const addComment = async (req, res) => {
  try {
    const database = client.db("noob");
    const collection = database.collection("post_comments");
    const { postId, content, author, createdAt } = req.body;

    const newComment = {
      content,
      author,
      createdAt: new Date(createdAt),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      res.status(500).send({ error: 'An error occurred while adding the comment' });
    } else {
      res.status(200).send(newComment);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send({ error: 'An error occurred while adding the comment' });
  }
};


const getComment = async (req, res) => {
  try {
    const database = client.db("noob");
    const collection = database.collection("post_comments");

    const { postId } = req.query;

    const post = await collection.findOne({ _id: new ObjectId(postId) });
    if (post && post.comments) {
      res.status(200).send({ comments: post.comments });
    } else {
      res.status(404).send({ comments: [] });
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send({ error: 'An error occurred while fetching comments' });
  }
};


const addQuesComment = async (req, res) => {
  try {
    const { questionId, text, userId } = req.body;
    const database = client.db('noob');
    const collection = database.collection('ques_comments');

    const commentId = new ObjectId();
    const updateResult = await collection.updateOne(
      { questionId },
      {
        $push: { comments: { _id: commentId, text, parentId: null, userId, replies: [] } }
      },
      { upsert: true } // This option creates a new document if no document matches the query
    );

    if (updateResult.upsertedCount > 0) {
      // New document created
      res.json({ success: true, commentId, message: 'New document created and comment added' });
    } else if (updateResult.matchedCount > 0) {
      // Existing document updated
      res.json({ success: true, commentId, message: 'Comment added to existing document' });
    } else {
      res.status(404).json({ success: false, error: 'No comments found and no new document created' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};



const addQuesReply = async (req, res) => {
  try {
    const { questionId, text, parentId, userId } = req.body;
    const database = client.db('noob');
    const collection = database.collection('ques_comments');

    const ques_comments = await collection.findOne({ questionId });

    if (ques_comments) {
      const replyId = new ObjectId();
      const newReply = { _id: replyId, text, parentId, userId, replies: [] };

      const addReplyToComment = (comments, parentId, reply) => {
        for (let comment of comments) {
          if (comment._id.equals(parentId)) {
            comment.replies.push(reply);
            return true;
          } else if (comment.replies && comment.replies.length > 0) {
            if (addReplyToComment(comment.replies, parentId, reply)) {
              return true;
            }
          }
        }
        return false;
      };

      if (addReplyToComment(ques_comments.comments, new ObjectId(parentId), newReply)) {
        await collection.updateOne(
          { questionId },
          { $set: { comments: ques_comments.comments } }
        );
        res.json({ success: true, reply: newReply });
      } else {
        res.status(404).json({ error: 'Parent comment not found' });
      }
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQuesComments = async(req,res)=>{
  try {
    const questionId = req.query.questionId;
    console.log(questionId);
    const database = client.db('noob');
    const collection = database.collection('ques_comments');

    const ques_comments = await collection.findOne({questionId : questionId});
    if (ques_comments) {
      res.json({ success: true, comments: ques_comments.comments });
    } else {
        res.status(404).json({ error: 'No comments found for this question' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = {
    findAllQuestions,
    findQuestionById,
    Addlikes,
    AddDislike,
    getAllTestCases,
    getExampleTestCases,
    addPost,
    getPost,
    addComment,
    getComment,
    addQuesComment,
    addQuesReply,
    getQuesComments
}