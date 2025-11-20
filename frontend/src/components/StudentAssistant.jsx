import React, { useState } from "react";
import axios from "axios";
import styles from "../css/Student.module.css";
import ui from '../css/UI.module.css';
import { FiMessageSquare } from 'react-icons/fi';

const StudentAssistant = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/student", {
        question,
        userId: "anon",
      });
      setResponse(res.data.ai.text || "Sin respuesta");
    } catch (error) {
      setResponse("Error al consultar el chatbot");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${ui.hoverLift} ${ui.fadeIn}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className={ui.iconCircle}><FiMessageSquare className={ui.iconSvg} /></span>
          <h3 className={styles.title} style={{ margin: 0 }}>Chatbot Estudiantil</h3>
        </div>
        <form onSubmit={handleSubmit} className={styles.formRow}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Escribe tu pregunta..."
            rows={3}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`${styles.button} ${ui.btnSmooth}`} type="submit" disabled={loading}> {loading ? 'Consultando...' : 'Preguntar'}</button>
            <button type="button" className={`${styles.mutedBtn} ${ui.btnSmooth}`} onClick={() => { setQuestion(''); setResponse(''); }}>
              Limpiar
            </button>
          </div>
        </form>

        <hr style={{ border: 'none', height: 12 }} />

        {response && (
          <div className={styles.responseBox}>
            {response}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssistant;
