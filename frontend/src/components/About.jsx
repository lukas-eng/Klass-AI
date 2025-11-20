import React from 'react';
import styles from '../css/Student.module.css';
import ui from '../css/UI.module.css';
import { FiMessageSquare, FiCalendar, FiFileText, FiUsers } from 'react-icons/fi';
import owl from '../img/klass-ai.jpeg';

const About = ({ onStart, onNavigate, hideRedirects }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.aboutHero}>
          <img src={owl} alt="Klass-AI" className={styles.aboutImageLarge} />
          <div>
            <h2 className={styles.title}>Hola — Soy Klass-AI</h2>
            <p style={{ marginTop: 6 }}>Tu asistente educativo: aclara dudas, genera planes de estudio y crea material de práctica en segundos. Probémoslo.</p>
            {!hideRedirects && (
              <div className={styles.ctaRow} style={{ marginTop: 12 }}>
                <button className={styles.button} onClick={() => onStart && onStart()}>Comenzar con Klass-AI</button>
                <button className={styles.secondaryButton} onClick={() => onNavigate && onNavigate('plan')}>Ver plan de estudio</button>
                <button className={styles.secondaryButton} onClick={() => onNavigate && onNavigate('foro')}>Ir al foro</button>
              </div>
            )}
          </div>
        </div>

        <hr style={{ margin: '18px 0', border: 'none', height: 1, background: '#eef6ef' }} />

        <section id="features">
          <h3 className={styles.title}>Funciones principales</h3>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${ui.hoverLift} ${ui.fadeIn}`}>
              <div className={styles.featureIcon + ' ' + ui.iconCircle}><FiMessageSquare className={ui.iconSvg} /></div>
              <div>
                <h4>Chat inteligente</h4>
                <p className={styles.muted}>Explicaciones paso a paso, ejemplos y recursos para entender mejor.</p>
              </div>
            </div>

            <div className={`${styles.featureCard} ${ui.hoverLift} ${ui.fadeIn}`}>
              <div className={styles.featureIcon + ' ' + ui.iconCircle}><FiCalendar className={ui.iconSvg} /></div>
              <div>
                <h4>Planes personalizados</h4>
                <p className={styles.muted}>Cronogramas y actividades adaptadas a tu nivel y tiempo disponible.</p>
              </div>
            </div>

            <div className={`${styles.featureCard} ${ui.hoverLift} ${ui.fadeIn}`}>
              <div className={styles.featureIcon + ' ' + ui.iconCircle}><FiFileText className={ui.iconSvg} /></div>
              <div>
                <h4>Generador de exámenes</h4>
                <p className={styles.muted}>Crea ejercicios y claves en minutos para practicar o evaluar.</p>
              </div>
            </div>

            <div className={`${styles.featureCard} ${ui.hoverLift} ${ui.fadeIn}`}>
              <div className={styles.featureIcon + ' ' + ui.iconCircle}><FiUsers className={ui.iconSvg} /></div>
              <div>
                <h4>Foro colaborativo</h4>
                <p className={styles.muted}>Publica dudas y comparte soluciones con la comunidad estudiantil.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" style={{ marginTop: 14 }}>
          <h3 className={styles.title}>Para quiénes</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <h4>Estudiantes</h4>
              <p className={styles.muted}>Explicaciones sencillas, práctica guiada y planes descargables.</p>
            </div>
            <div style={{ flex: '1 1 280px' }}>
              <h4>Docentes</h4>
              <p className={styles.muted}>Genera exámenes, materiales y actividades diferenciadas rápidamente.</p>
            </div>
          </div>
        </section>

        <section id="testimonials" style={{ marginTop: 16 }}>
          <h3 className={styles.title}>Lo que dicen</h3>
          <div className={styles.testimonial}>
            <div className={styles.testimonialQuote}>"Klass-AI me ayudó a entender geometría en una semana. Las explicaciones son claras y las prácticas muy útiles."</div>
            <div className={styles.testimonialAuthor}>— María, estudiante de secundaria</div>
          </div>
        </section>

        <section id="team" style={{ marginTop: 12 }}>
          <h3 className={styles.title}>Quiénes somos</h3>
          <p className={styles.muted}>Equipo de educadores, diseñadores y especialistas en IA dedicados a crear herramientas útiles y accesibles para el aprendizaje.</p>
        </section>
      </div>
    </div>
  );
};

export default About;
