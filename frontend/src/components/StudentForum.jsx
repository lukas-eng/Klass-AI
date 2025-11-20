import React, { useState, useEffect } from 'react';
import styles from "../css/Student.module.css";
import ui from '../css/UI.module.css';
import { FiUsers } from 'react-icons/fi';

const StudentForum = ({ userEmail }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState({});

  useEffect(() => {
    fetch('https://klass-ai.onrender.com/forum/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const postData = {
      email: userEmail,
      content: newPost,
      timestamp: new Date().toISOString()
    };
    await fetch('https://klass-ai.onrender.com/forum/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    setNewPost('');
    fetch('https://klass-ai.onrender.com/forum/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  const handleReply = async (postId) => {
    if (!replyContent[postId] || !replyContent[postId].trim()) return;
    const replyData = {
      post_id: postId,
      email: userEmail,
      content: replyContent[postId],
      timestamp: new Date().toISOString()
    };
    await fetch('https://klass-ai.onrender.com/forum/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData)
    });
    setReplyContent({ ...replyContent, [postId]: '' });
    fetch('https://klass-ai.onrender.com/forum/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${ui.hoverLift} ${ui.fadeIn}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className={ui.iconCircle}><FiUsers className={ui.iconSvg} /></span>
          <h3 className={styles.title} style={{ margin: 0 }}>Foro de Estudiantes</h3>
        </div>
        <form onSubmit={handlePost} className={styles.formRow}>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Escribe tu duda o comentario..."
            rows={3}
          />
            <div style={{ display: 'flex', gap: 8 }}>
            <button className={`${styles.button} ${ui.btnSmooth}`} type="submit">Publicar</button>
            <button type="button" className={`${styles.mutedBtn} ${ui.btnSmooth}`} onClick={() => setNewPost('')}>Limpiar</button>
          </div>
        </form>

        <hr style={{ border: 'none', height: 12 }} />

        <div>
          {posts.length === 0 ? <p className={styles.postMeta}>No hay posts aún.</p> : posts.map((post, idx) => (
            <div key={idx} className={`${styles.forumPost} ${ui.hoverLift}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong>{post.email}</strong>
                <span className={styles.postMeta}>{new Date(post.timestamp).toLocaleString()}</span>
              </div>
              <p style={{ marginTop: 8 }}>{post.content}</p>
                <div style={{ marginTop: 8 }}>
                <h4 style={{ margin: '8px 0' }}>Respuestas:</h4>
                {post.replies && post.replies.length > 0 ? (
                  post.replies.map((reply, rIdx) => (
                    <div key={rIdx} style={{ marginLeft: '0.5em', borderLeft: '2px solid #eef6ee', paddingLeft: '1em', marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{reply.email}</strong>
                        <span className={styles.postMeta}>{new Date(reply.timestamp).toLocaleString()}</span>
                      </div>
                      <p style={{ margin: '6px 0' }}>{reply.content}</p>
                    </div>
                  ))
                ) : <p className={styles.postMeta}>No hay respuestas aún.</p>}

                <textarea
                  value={replyContent[idx] || ''}
                  onChange={e => setReplyContent({ ...replyContent, [idx]: e.target.value })}
                  placeholder="Escribe una respuesta..."
                  rows={2}
                />
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className={`${styles.button} ${ui.btnSmooth}`} onClick={() => handleReply(idx)}>Responder</button>
                  {post.email === userEmail && (
                    <button className={`${styles.mutedBtn} ${ui.btnSmooth}`} style={{ color: 'red' }} onClick={async () => {
                      await fetch(`https://klass-ai.onrender.com/forum/post/${idx}?email=${userEmail}`, {
                        method: 'DELETE'
                      });
                      fetch('https://klass-ai.onrender.com/forum/posts')
                        .then(res => res.json())
                        .then(data => setPosts(data));
                    }}>Eliminar</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentForum;

