import React, { useEffect, useState } from "react";
import { getCommentsByCar, addComment } from "../services/ApiComment";
import AOS from 'aos'; 
import 'aos/dist/aos.css';
export default function CommentCards({ carId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  // envoie le commentaire
  const submitComment = async (e) => {
    e.preventDefault();
    try {
      await addComment(carId, newComment);
      setNewComment("");
      setError("");
      await getComments();
    } catch (error) {
      setError(
        error.response?.data?.message
      );
    }
  };

  // récupérer les commentaires
  const getComments = async () => {
    try {
      const response = await getCommentsByCar(carId);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error(error);
      setComments([]);
    }
  };
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);
  useEffect(() => {
    AOS.refresh();
  }, [comments]);

  useEffect(() => {
    if (carId) {
      getComments();
    }
  }, [carId]);
 
  return (
    <div data-aos="fade-up">
    <div className="space-y-4 mt-6 p-8">
    <div data-aos="fade-up">
      <form onSubmit={submitComment} className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Entrez votre commentaire"
          value={newComment}
          onChange={handleChange}
          className="flex-1 bg-gray-200 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-24 h-12 bg-amber-400 rounded-3xl text-white hover:bg-amber-500 transition-colors"
        >
          Ajouter
        </button>

      </form>
      </div>
      {error && (
        <div className="text-red-500 text-center mt-2">{error}</div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Commentaires ({comments.length})
      </h2>
      {comments.length === 0 ? (
        <div className="text-center mt-4 text-gray-500">
          Aucun commentaire pour cette voiture
        </div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {comment.userId.user_image && (
                  <img
                    src={comment.userId.user_image}
                    alt={`${comment.userId.username}'s avatar`}
                    className="h-10 w-10 rounded-full object-cover mr-2"
                  />
                )}
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
          
        ))
        
      )}
      
    </div>
    </div>
  );
}
