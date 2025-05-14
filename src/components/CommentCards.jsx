import React, { useEffect, useState } from "react";
import { getCommentsByCar, addComment, deleteComment, updateComment } from "../services/ApiComment";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle, FaClock, FaPaperPlane, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

export default function CommentCards({ carId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Au début du composant, ajoutons une fonction pour décoder le token
  const getCurrentUser = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      // Le token JWT est composé de 3 parties séparées par des points
      // Nous voulons la deuxième partie qui contient les données
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  console.log("Decoded User:", currentUser);
  console.log("Current User ID:", currentUserId);

  const handleChange = (e) => {
    setNewComment(e.target.value);
    if (error) setError("");
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(carId, newComment);
      setNewComment("");
      setError("");
      toast.success("Commentaire ajouté avec succès", {
        position: "bottom-right",
        theme: "colored"
      });
      await getComments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout du commentaire");
      setError(error.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getComments = async () => {
    try {
      const response = await getCommentsByCar(carId);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error(error);
      setComments([]);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, carId);
      toast.success("Commentaire supprimé avec succès", {
        position: "bottom-right",
        theme: "colored"
      });
      await getComments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du commentaire");
    }
  };

  // Fonction pour démarrer l'édition
  const startEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  // Fonction pour annuler l'édition
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // Fonction pour mettre à jour le commentaire
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      setIsSubmitting(true);
      await updateComment(commentId, editContent);
      toast.success("Commentaire modifié avec succès", {
        position: "bottom-right",
        theme: "colored"
      });
      await getComments();
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la modification du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    if (carId) getComments();
  }, [carId]);

  useEffect(() => {
    AOS.refresh();
  }, [comments]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8" data-aos="fade-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        Commentaires
        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
          {comments.length}
        </span>
      </h2>

      {/* Formulaire de commentaire */}
      <div className="mb-8">
        <form onSubmit={submitComment} className="space-y-4">
          <div className="relative">
            <textarea
              placeholder="Partagez votre avis..."
              value={newComment}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                error ? 'border-red-500' : 'border-gray-200'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24`}
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white transition-all ${
                isSubmitting || !newComment.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FaPaperPlane />
              {isSubmitting ? 'Envoi...' : 'Commenter'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Aucun commentaire pour le moment</p>
            <p className="text-sm mt-2">Soyez le premier à donner votre avis !</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              data-aos="fade-up"
            >
              <div className="flex items-start gap-4">
                {comment.userId.user_image ? (
                  <img
                    src={comment.userId.user_image}
                    alt={comment.userId.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-400" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {comment.userId.username}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentUserId && comment.userId._id === currentUserId && (
                        editingCommentId === comment._id ? (
                          <>
                            <button
                              onClick={() => handleUpdateComment(comment._id)}
                              disabled={isSubmitting}
                              className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-full hover:bg-green-50"
                              title="Enregistrer les modifications"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-50"
                              title="Annuler les modifications"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(comment)}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                              title="Modifier le commentaire"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                              title="Supprimer le commentaire"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </>
                        )
                      )}
                    </div>
                  </div>
                  {editingCommentId === comment._id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
