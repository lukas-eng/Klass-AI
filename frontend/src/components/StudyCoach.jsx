import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import styles from "../css/Student.module.css";
import ui from '../css/UI.module.css';
import { FiCalendar } from 'react-icons/fi';

export default function StudyCoach() {
  const [tema, setTema] = useState("");
  const [nivel, setNivel] = useState("básico");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    setLoading(true);

    try {
      const res = await axios.post("https://klass-ai.onrender.com/coach", {
        tema,
        nivel,
      });
      setResult(res.data.ai);
    } catch {
      setResult({ text: "Error al conectar con el backend." });
    }

    setLoading(false);
  };

  const downloadPdf = () => {
    if (!result || !result.text) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const lines = doc.splitTextToSize(result.text, 500);
    const marginTop = 40;
    doc.setFontSize(12);
    doc.text(lines, 40, marginTop);
    doc.save("plan_de_estudio.pdf");
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${ui.hoverLift} ${ui.fadeIn}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className={ui.iconCircle}><FiCalendar className={ui.iconSvg} /></span>
          <h2 className={styles.title} style={{ margin: 0 }}>Asistente Personal de Estudio</h2>
        </div>

        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="Tema a estudiar"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
          />

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option>Básico</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>

            <button
              className={`${styles.button} ${ui.btnSmooth}`}
              onClick={ask}
              disabled={!tema || loading}
            >
              {loading ? "Generando..." : "Pedir plan"}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ marginTop: 15 }}>
            <div className={styles.responseBox}><pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{result.text}</pre></div>
            <div style={{ marginTop: 10 }}>
              <button className={styles.button} onClick={downloadPdf}>Descargar PDF</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ width: 20 }} />
    </div>
  );
}

