import React, { useState, useEffect } from 'react';
import { getAllMessages, MarquerAsRead } from '../../services/ApiContact';
import { PropagateLoader } from 'react-spinners';
import { FaEnvelope, FaPhone, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

const MessagesMangement = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [loadingStates, setLoadingStates] = useState({
        fetchMessages: false,
        markAsRead: false
    });

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setLoadingStates(prev => ({ ...prev, fetchMessages: true }));
            const response = await getAllMessages();
            setMessages(response.data || []);
            setError(null);
        } catch (error) {
            setError('Erreur lors du chargement des messages');
            console.error('Erreur:', error);
            setMessages([]);
        } finally {
            setLoading(false);
            setLoadingStates(prev => ({ ...prev, fetchMessages: false }));
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const ReadMessage = async (id) => {
        try {
            setLoadingStates(prev => ({ ...prev, markAsRead: true }));
            const response = await MarquerAsRead(id);

            if (response.data) {
                setMessages(prevMessages =>
                    prevMessages.map(message =>
                        message._id === id ? { ...message, statut: 'lu' } : message
                    )
                );

                if (selectedMessage?._id === id) {
                    setSelectedMessage(prev => ({ ...prev, statut: 'lu' }));
                }

                showNotification('Message marqué comme lu avec succès');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showNotification('Erreur lors de la mise à jour du message', 'error');
        } finally {
            setLoadingStates(prev => ({ ...prev, markAsRead: false }));
            fetchMessages();
        }
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'non_lu':
                return 'bg-red-100 text-red-800';
            case 'lu':
                return 'bg-blue-100 text-blue-800';
            case 'en_cours':
                return 'bg-yellow-100 text-yellow-800';
            case 'traité':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'non_lu':
                return <FaEnvelope className="mr-2" />;
            case 'lu':
                return <FaCheckCircle className="mr-2" />;
            case 'en_cours':
                return <FaHourglassHalf className="mr-2" />;
            case 'traité':
                return <FaCheckCircle className="mr-2" />;
            default:
                return <FaTimesCircle className="mr-2" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const LoadingOverlay = () => (
        loadingStates.fetchMessages && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <PropagateLoader color="#3B82F6" size={10} />
            </div>
        )
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <PropagateLoader color="#3B82F6" />
                <p className="mt-4 text-gray-600">Chargement des messages...</p>
            </div>
        );
    }


    return (
        <div className="mr-4 p-6 bg-gray-50 mt-10 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Messages</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Liste des messages */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                    <LoadingOverlay />
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Messages reçus</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {messages.length} message{messages.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedMessage?._id === message._id ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-gray-900">{message.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs flex items-center ${getStatusColor(message.statut)}`}>
                                        {getStatusIcon(message.statut)}
                                        {message.statut || 'non_lu'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{message.sujet}</p>
                                <div className="flex items-center text-xs text-gray-500 space-x-4">
                                    <span className="flex items-center">
                                        <FaClock className="mr-1" />
                                        {formatDate(message.dateEnvoi)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Détails du message sélectionné */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {selectedMessage ? (
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                                    {selectedMessage.sujet}
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-xs inline-flex items-center ${getStatusColor(selectedMessage.statut)}`}>
                                    {getStatusIcon(selectedMessage.statut)}
                                    {selectedMessage.statut || 'non_lu'}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <span className="font-medium">De:</span>
                                    <span>{selectedMessage.name}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaEnvelope className="text-gray-400" />
                                    <span>{selectedMessage.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaPhone className="text-gray-400" />
                                    <span>{selectedMessage.telephone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaClock className="text-gray-400" />
                                    <span>{formatDate(selectedMessage.dateEnvoi)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-medium text-gray-800 mb-3">Message</h3>
                                <p className="text-gray-600 whitespace-pre-line">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {selectedMessage.statut === 'non_lu' && (
                                <div className="mt-6">
                                    <button
                                        className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${loadingStates.markAsRead ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        onClick={() => ReadMessage(selectedMessage._id)}
                                        disabled={loadingStates.markAsRead}
                                    >
                                        {loadingStates.markAsRead ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Mise à jour...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle className="w-5 h-5" />
                                                Marquer comme lu
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            <FaEnvelope className="mx-auto text-4xl mb-4 text-gray-300" />
                            <p>Sélectionnez un message pour voir les détails</p>
                        </div>
                    )}
                </div>
            </div>

            {notification.show && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                    } text-white z-50`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default MessagesMangement;


