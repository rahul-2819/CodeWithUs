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
    const category = await collection.findOne({
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
    // console.log(postId);
    let item;
    if(postId && selectedTab){
      let filter = {
        _id: selectedTab
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
// endpoint to add comments on a post
const addComment = async (req, res) => {
  try {
    const { postId, text, userId } = req.body;
    const database = client.db('noob');
    const collection = database.collection('post_comments');

    const newComment = {
      _id: new ObjectId(), // Generate new ObjectId for the comment
      text,
      userId,
      createdAt: new Date(), // Add current timestamp for createdAt
      replies: [] // Initialize replies array for nested comments if needed
    };

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComment } },
      { upsert: true } // Creates a new document if no matching document found
    );

    if (updateResult.upsertedCount > 0) {
      // New document created
      res.status(200).json({ success: true, commentId: newComment._id, message: 'New comment added' });
    } else if (updateResult.matchedCount > 0) {
      // Existing document updated
      res.status(200).json({ success: true, commentId: newComment._id, message: 'Comment added to existing document' });
    } else {
      res.status(404).json({ success: false, error: 'No comments found and no new document created' });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// endpoint to reply on a comment on a post
const addCommentReply = async (req, res) => {
  try {
    const { postId, parentId, text, userId } = req.body;
    const database = client.db('noob');
    const collection = database.collection('post_comments');

    const post_comments = await collection.findOne({ _id: new ObjectId(postId) });

    if (post_comments) {
      const replyId = new ObjectId();
      const newReply = { _id: replyId, text, parentId: new ObjectId(parentId), userId, replies: [] };

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

      if (addReplyToComment(post_comments.comments, new ObjectId(parentId), newReply)) {
        await collection.updateOne(
          { _id: new ObjectId(postId) },
          { $set: { comments: post_comments.comments } }
        );
        res.json({ success: true, reply: newReply });
      } else {
        res.status(404).json({ error: 'Parent comment not found' });
      }
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error adding comment reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// endpoint to get all comment of a post
const getComment = async (req, res) => {
  try {
    const postId = req.query.postId;
    const database = client.db('noob');
    const collection = database.collection('post_comments');

    const post_comments = await collection.findOne({ _id: new ObjectId(postId) });

    if (post_comments) {
      res.json({ success: true, comments: post_comments.comments });
    } else {
      res.status(404).json({ error: 'No comments found for this post' });
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    // console.log(questionId);
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
    addCommentReply,
    getComment,
    addQuesComment,
    addQuesReply,
    getQuesComments
}