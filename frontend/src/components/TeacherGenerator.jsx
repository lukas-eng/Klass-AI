import React, { useState } from "react";
import axios from "axios";
import ui from '../css/UI.module.css';
import styles from '../css/Student.module.css';
import { FiFileText, FiPlay, FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';

export default function TeacherGenerator() {
  const [competencia, setCompetencia] = useState("");
  const [tipo, setTipo] = useState("examen");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    try {
      const res = await axios.post("https://klass-ai.onrender.com/teacher", {
        competencia,
        tipo,
      });
      setResult(res.data.ai);
    } catch (err) {
      setResult({ text: "Error al conectar con el backend." });
    }

    setLoading(false);
  };

  const downloadPdf = () => {
    if (!result || !result.text) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const left = 40;
    const top = 60;
    const maxWidth = 510; // A4 width in pt minus margins
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(result.text, maxWidth);
    doc.text(lines, left, top);
    doc.save('examen.pdf');
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${ui.hoverLift} ${ui.fadeIn}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span className={ui.iconCircle}><FiFileText className={ui.iconSvg} /></span>
        <h2 style={{ margin: 0 }}>Generador para Docentes</h2>
      </div>

      <input
        type="text"
        placeholder="Competencia o tema"
        style={{ width: "100%" }}
        value={competencia}
        onChange={(e) => setCompetencia(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="examen">Examen</option>
          <option value="caso">Caso clínico</option>
          <option value="rúbrica">Rúbrica</option>
        </select>

        <button
          onClick={generate}
          disabled={!competencia || loading}
          className={`${styles.button} ${ui.btnSmooth}`}
          style={{ marginLeft: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          {loading ? "Generando..." : <><FiPlay /> Generar</>}
        </button>
        {result && (
          <button
            onClick={downloadPdf}
            className={`${styles.secondaryButton} ${ui.btnSmooth}`}
            style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <FiDownload /> Descargar PDF
          </button>
        )}
      </div>

      {result && (
        <pre style={{ marginTop: 15, whiteSpace: "pre-wrap" }}>
          {result.text}
        </pre>
      )}
      </div>
    </div>
  );
}

