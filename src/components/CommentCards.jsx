import React, { useEffect, useState } from "react";
import { getCommentsByCar } from "../services/ApiComment";

export default function CommentCards({ carId }) { // recupérez carId depuis les props
  const [comments, setComments] = useState([]);
 

  const Comments = async () => {
    try {
      const response = await getCommentsByCar(carId); 
      setComments(response.data.comments || []); 
    } catch (error) {
      console.error(error);
      setComments([]);
    } 
  };

  useEffect(() => {
    if (carId) {
     Comments();
    }
  }, [carId]);

  

  if (!comments.length) {
    return <div className="text-center mt-4 text-gray-500">Aucun commentaire pour cette voiture</div>;
  }

  return (
    <div className="space-y-4 mt-6 p-8">
    <span>
    <input
            type="text"
            placeholder="Enter Your comment"
            className="w-7xl min-w-2xl bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
     <button className="w-24 h-12 bg-amber-400 mx-6 rounded-3xl text-white">Add</button>
    </span>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Commentaires ({comments.length})</h2>
      {comments.map((comment) => (
        <div 
          key={comment._id} 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {comment.userId.username}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                {comment.createdAt}
              </span>
            </div>
         
          </div>
          <p className="text-gray-700 leading-relaxed">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  );
}