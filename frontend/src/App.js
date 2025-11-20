import React, { useState, useEffect, useRef } from "react";
import AuthForm from "./components/AuthForm";
import StudentAssistant from "./components/StudentAssistant";
import StudyCoach from "./components/StudyCoach";
import About from "./components/About";
import TeacherGenerator from "./components/TeacherGenerator";
import StudentForum from "./components/StudentForum";
import UserProfile from "./components/UserProfile";
import styles from "./css/App.module.css";
import unisanitasLogo from "./img/unisanitas.png";
import decorImg from "./img/keralty.png";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [studentTab, setStudentTab] = useState("chatbot");
  const [teacherTab, setTeacherTab] = useState("generator");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSuccess = (role, email, nombre, apellido) => {
    setUserRole(role);
    setUserEmail(email);
    setNombre(nombre);
    setApellido(apellido);
  };

  const handleProfileUpdate = (newNombre, newApellido, newPassword) => {
    setNombre(newNombre);
    setApellido(newApellido);
    setPassword(newPassword);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserEmail(null);
    setNombre("");
    setApellido("");
    setPassword("");
    setStudentTab("chatbot");
    setTeacherTab("generator");
  };
  const truncate = (str, max = 18) => {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '...' : str;
  };
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setShowAvatarMenu(false);
        setMobileNavOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 760) setMobileNavOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleMenuToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 760) {
      setMobileNavOpen(s => !s);
      setShowAvatarMenu(false);
    } else {
      setShowAvatarMenu(s => !s);
    }
  };

  // Footer autohide on scroll: hide when scrolling down, show when scrolling up
  const [footerHidden, setFooterHidden] = useState(false);
  useEffect(() => {
    let lastScroll = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      const current = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (current > lastScroll + 10 && current > 120) {
            setFooterHidden(true);
          } else if (current < lastScroll - 10) {
            setFooterHidden(false);
          }
          lastScroll = current;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="App">
      <div className={styles.appContainer}>
        <header className={styles.headerBar}>
          <div className={styles.brand}>
            <img src={unisanitasLogo} alt="Unisanitas" className={styles.logo} />
            <div className={styles.titleText}>{(nombre || apellido) ? `Bienvenido ${truncate(`${nombre} ${apellido}`.trim())}` : 'Bienvenido'}</div>
          </div>

          {userRole && (
            <nav className={styles.nav}>
              {userRole === "student" ? (
                <>
                  <button className={`${styles.navButton} ${studentTab === 'chatbot' ? styles.active : ''}`} onClick={() => setStudentTab('chatbot')}>Klass-AI</button>
                  <button className={`${styles.navButton} ${studentTab === 'plan' ? styles.active : ''}`} onClick={() => setStudentTab('plan')}>Plan de estudio</button>
                  <button className={`${styles.navButton} ${studentTab === 'foro' ? styles.active : ''}`} onClick={() => setStudentTab('foro')}>Foro</button>
                  <button className={`${styles.navButton} ${studentTab === 'about' ? styles.active : ''}`} onClick={() => setStudentTab('about')}>Qué se puede hacer</button>
                </>
              ) : (
                <>
                  <button className={`${styles.navButton} ${teacherTab === 'generator' ? styles.active : ''}`} onClick={() => setTeacherTab('generator')}>Generar examen</button>
                  <button className={`${styles.navButton} ${teacherTab === 'about' ? styles.active : ''}`} onClick={() => setTeacherTab('about')}>Qué se puede hacer</button>
                  <button className={`${styles.navButton} ${teacherTab === 'foro' ? styles.active : ''}`} onClick={() => setTeacherTab('foro')}>Foro</button>
                </>
              )}
            </nav>
          )}

          <div className={styles.profileArea}>
            {userRole ? (
              <>
                <div ref={avatarRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    className={`${styles.hamburgerBtn} ${showAvatarMenu || mobileNavOpen ? styles.open : ''}`}
                    aria-haspopup="true"
                    aria-expanded={showAvatarMenu || mobileNavOpen}
                    onClick={handleMenuToggle}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleMenuToggle(); }}
                    aria-label="Abrir menú"
                  >
                    <span className={styles.hamburgerLines}>
                      <span className={styles.line} />
                      <span className={styles.line} />
                      <span className={styles.line} />
                    </span>
                  </button>
                  {showAvatarMenu && !mobileNavOpen && (
                    <div className={styles.avatarMenu} role="menu">
                      <div className={styles.avatarMenuHeader}>
                          <div style={{display:'flex', flexDirection:'column'}}>
                            <div className={styles.avatarName}>{nombre} {apellido}</div>
                            <div className={styles.avatarEmail}>{userEmail}</div>
                          </div>
                        </div>
                      <button className={styles.avatarMenuItem} onClick={() => { if (userRole === 'student') setStudentTab('perfil'); else setTeacherTab('perfil'); setShowAvatarMenu(false); }} role="menuitem">Ver perfil</button>
                      <button className={styles.avatarMenuItem} onClick={() => { setShowAvatarMenu(false); handleLogout(); }} role="menuitem">Cerrar sesión</button>
                    </div>
                  )}
                </div>
                
              </>
            ) : null}
          </div>
        </header>

        {mobileNavOpen && (
          <div className={styles.mobileNavOverlay} role="dialog" aria-modal="true">
            <nav className={styles.mobileNavInner}>
              {userRole === "student" ? (
                <>
                  <button className={styles.mobileNavItem} onClick={() => { setStudentTab('chatbot'); setMobileNavOpen(false); }}>Klass-AI</button>
                  <button className={styles.mobileNavItem} onClick={() => { setStudentTab('plan'); setMobileNavOpen(false); }}>Plan de estudio</button>
                  <button className={styles.mobileNavItem} onClick={() => { setStudentTab('foro'); setMobileNavOpen(false); }}>Foro</button>
                  <button className={styles.mobileNavItem} onClick={() => { setStudentTab('about'); setMobileNavOpen(false); }}>Qué se puede hacer</button>
                </>
              ) : (
                <>
                  <button className={styles.mobileNavItem} onClick={() => { setTeacherTab('generator'); setMobileNavOpen(false); }}>Generar examen</button>
                  <button className={styles.mobileNavItem} onClick={() => { setTeacherTab('about'); setMobileNavOpen(false); }}>Qué se puede hacer</button>
                  <button className={styles.mobileNavItem} onClick={() => { setTeacherTab('foro'); setMobileNavOpen(false); }}>Foro</button>
                </>
              )}
              <div style={{height:8}} />
              <div style={{borderTop:'1px solid rgba(0,0,0,0.06)', marginTop:8, paddingTop:8}}>
                <button className={styles.mobileNavItem} onClick={() => { if (userRole === 'student') setStudentTab('perfil'); else setTeacherTab('perfil'); setMobileNavOpen(false); }}>Ver perfil</button>
                <button className={styles.mobileNavItem} onClick={() => { setMobileNavOpen(false); handleLogout(); }}>Cerrar sesión</button>
              </div>
            </nav>
          </div>
        )}

        {!userRole ? (
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        ) : userRole === "student" ? (
          <main className={styles.main}>
            {studentTab === "chatbot" && <StudentAssistant />}
            {studentTab === "plan" && <StudyCoach />}
            {studentTab === "foro" && <StudentForum userEmail={userEmail} />}
            {studentTab === "about" && <About onStart={() => setStudentTab('chatbot')} onNavigate={(tab) => setStudentTab(tab)} />}
            {studentTab === "perfil" && <UserProfile
              userEmail={userEmail}
              nombre={nombre}
              apellido={apellido}
              password={password}
              onProfileUpdate={handleProfileUpdate}
            />}
            <img src={decorImg} alt="Decorativo" className={styles.owlDecor} />
          </main>
          ) : (
          <main className={styles.main}>
            {teacherTab === "generator" && <TeacherGenerator />}
            {teacherTab === "about" && <About onNavigate={(tab) => setTeacherTab(tab)} hideRedirects />}
            {teacherTab === "foro" && <StudentForum userEmail={userEmail} />}
            {teacherTab === "perfil" && <UserProfile
              userEmail={userEmail}
              nombre={nombre}
              apellido={apellido}
              password={password}
              onProfileUpdate={handleProfileUpdate}
            />}
            <img src={decorImg} alt="Keralty" className={styles.owlDecor} />
          </main>
        )}
        <footer className={`${styles.footer} ${footerHidden ? styles.hiddenFooter : ''}`} aria-hidden={footerHidden}>
          © {new Date().getFullYear()} Klass-IA · Plataforma Educativa Inteligente · <span style={{color:'var(--muted)'}}>{userEmail || 'Sin sesión'}</span>
          <div style={{ marginTop: 8 }}>
            <a href="#help">Ayuda</a> · <a href="#terms">Términos</a> · <a href="#contact">Contacto</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
