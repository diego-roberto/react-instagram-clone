import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from "firebase";

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")                                        //acessa a coleção posts
                .doc(postId)                                                //vai até o documento que tem esse postId
                .collection("comments")                                     //então vai na collection de comments do post  
                .orderBy('timestamp', 'desc')                               //ordena por hora da postagem
                .onSnapshot((snapshot) => {                                 //e pega um snapshot do que tem lá... traz os comentários desse post
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }    

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg" //usa um avatar com a primeira letra do username
                />
                <h3>{username}</h3>
            </div>
            
            <img                
                className="post__image"
                src={imageUrl}
                alt=""                    
            />            

            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>            

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Adicione um comentário..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        disabled={!comment}
                        className="post__button"
                        type="submit"
                        onClick={postComment}
                    >
                    Comentar
                    </button>                
                </form>
            )}

        </div>        
    )
}

export default Post
