import React, { useState } from 'react';
import styles from '../css/Profile.module.css';
import ui from '../css/UI.module.css';

const UserProfile = ({ userEmail, nombre, apellido, password, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: nombre || '',
    apellido: apellido || '',
    password: password || ''
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ nombre, apellido, password });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('¿Estás seguro de que deseas guardar los cambios en tu perfil?')) return;
    const updateData = {
      email: userEmail,
      nombre: formData.nombre,
      apellido: formData.apellido,
      password: formData.password
    };
    try {
      const response = await fetch('http://127.0.0.1:8000/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Perfil actualizado exitosamente.');
        onProfileUpdate(formData.nombre, formData.apellido, formData.password);
        setIsEditing(false);
      } else {
        setMessage(data.detail || 'Error al actualizar el perfil');
      }
    } catch (err) {
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={`${styles.profileCard} ${ui.hoverLift} ${ui.fadeIn}`}>
        <h3 className={styles.profileTitle}>Mi Perfil</h3>

        {!isEditing ? (
          <div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <p><strong>Nombre:</strong> {formData.nombre}</p>
                <p><strong>Apellido:</strong> {formData.apellido}</p>
                <p><strong>Correo:</strong> {userEmail}</p>
              </div>
              <div>
                <button className={styles.saveBtn} onClick={handleEdit}>Editar</button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre</label>
                <input className={styles.input} type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Apellido</label>
                <input className={styles.input} type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Contraseña</label>
                <input className={styles.input} type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.saveBtn} type="submit">Guardar cambios</button>
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default UserProfile;
