import React, { useState } from 'react';
import styles from "../css/AuthForm.module.css";
import ui from '../css/UI.module.css';
import { FiUser } from 'react-icons/fi';
import klassImg from "../img/klass-ai.jpeg";

const AuthForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    nombre: '',
    apellido: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register' : '/login';
    const url = `https://klass-ai.onrender.com${endpoint}`;

    console.log("Datos enviados al backend:", formData);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (!isRegister) {
          onLoginSuccess(data.role, formData.email, data.nombre, data.apellido);
        } else {
          alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
          setIsRegister(false);
        }
      } else {
        setErrorMessage(data.detail || 'Error en la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={`${styles.card} ${ui.hoverLift} ${ui.fadeIn}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span className={ui.iconCircle}><FiUser className={ui.iconSvg} /></span>
            <h2 className={styles.title} style={{ margin: 0 }}>{isRegister ? 'Registro' : 'Inicio de Sesión'}</h2>
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className={styles.row}>
              <div className={`${styles.field} ${styles.half}`}>
                <label className={styles.label}>Nombre:</label>
                <input
                  className={styles.input}
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`${styles.field} ${styles.half}`}>
                <label className={styles.label}>Apellido:</label>
                <input
                  className={styles.input}
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Correo Electrónico:</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Contraseña:</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {isRegister && (
            <div className={styles.field}>
              <label className={styles.label}>Rol:</label>
              <select className={styles.input} name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Estudiante</option>
                <option value="teacher">Docente</option>
              </select>
            </div>
          )}

            <div style={{ marginTop: 8 }}>
            <button className={`${styles.buttonPrimary} ${ui.btnSmooth}`} type="submit">{isRegister ? 'Registrar' : 'Iniciar Sesión'}</button>
          </div>
          </form>

          <button className={styles.toggleBtn} onClick={() => {
            setIsRegister(!isRegister);
            setErrorMessage('');
          }}>
            {isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        <div className={styles.imageArea}>
          <img src={klassImg} alt="Klass-IA" className={styles.sideImage} />
        </div>
      </div>
    </div>
  );
};


export default AuthForm;
