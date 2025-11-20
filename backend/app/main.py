# app/main.py
import json
from fastapi import FastAPI, HTTPException, Response, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os
from .services import ai_gateway, student, teacher, coach
import logging
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

# Configurar logging para depurar solicitudes
logging.basicConfig(level=logging.INFO)

load_dotenv()


app = FastAPI(title="Plataforma Educativa Inteligente - FastAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir todos los orígenes temporalmente
    allow_credentials=True,
    allow_methods=["OPTIONS", "GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.middleware("http")
async def log_requests(request, call_next):
    logging.info(f"Solicitud recibida: {request.method} {request.url}")
    response = await call_next(request)
    logging.info(f"Respuesta enviada: {response.status_code}")
    return response

DB_PATH = "app/data/db.json"

def read_db():
    try:
        with open(DB_PATH, "r") as f:
            return json.load(f)
    except:
        return {}

def write_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)

# Modelos
class StudentQuery(BaseModel):
    question: str
    userId: str = "anon"

class TeacherInput(BaseModel):
    competencia: str
    tipo: str = "examen"

class CoachInput(BaseModel):
    tema: str
    nivel: str = "básico"
    userId: str = "anon"

class AIRequest(BaseModel):
    prompt: str

# Modelos para las solicitudes
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str
    nombre: str
    apellido: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Modelos para el foro
class ForumPost(BaseModel):
    email: str
    content: str
    timestamp: str

class ForumReply(BaseModel):
    post_id: int
    email: str
    content: str
    timestamp: str

# Endpoint para registrar usuarios
@app.post("/register")
def register_user(req: RegisterRequest):
    db = read_db()

    # Verificar si el correo ya está registrado
    if any(user['email'] == req.email for user in db.get('users', [])):
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")

    # Registrar nuevo usuario
    new_user = {
        "email": req.email,
        "password": req.password,
        "role": req.role,
        "nombre": req.nombre,
        "apellido": req.apellido
    }
    db.setdefault('users', []).append(new_user)
    write_db(db)

    return {"message": "Usuario registrado exitosamente."}

# Endpoint para iniciar sesión
@app.post("/login")
def login_user(req: LoginRequest):
    db = read_db()

    # Validar credenciales
    user = next((user for user in db.get('users', []) if user['email'] == req.email and user['password'] == req.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas.")

    return {
        "message": "Inicio de sesión exitoso.",
        "role": user['role'],
        "nombre": user.get('nombre', ''),
        "apellido": user.get('apellido', '')
    }

@app.post("/ai")
async def ai_endpoint(req: AIRequest):
    result = await ai_gateway.call_ai(req.prompt)
    return result

@app.post("/student")
async def student_endpoint(req: StudentQuery):
    prompt = student.build_prompt(req.question, req.userId)
    ai_res = await ai_gateway.call_ai(prompt)

    db = read_db()
    db.setdefault("student", []).append({
        "question": req.question,
        "userId": req.userId,
        "response": ai_res,
        "ts": os.times()
    })
    write_db(db)

    return {"prompt": prompt, "ai": ai_res}

@app.post("/teacher")
async def teacher_endpoint(req: TeacherInput):
    prompt = teacher.build_prompt(req.competencia, req.tipo)
    ai_res = await ai_gateway.call_ai(prompt)

    db = read_db()
    db.setdefault("teacher", []).append({
        "competencia": req.competencia,
        "tipo": req.tipo,
        "response": ai_res
    })
    write_db(db)

    return {"prompt": prompt, "ai": ai_res}

@app.post("/coach")
async def coach_endpoint(req: CoachInput):
    prompt = coach.build_prompt(req.tema, req.nivel)
    ai_res = await ai_gateway.call_ai(prompt)

    db = read_db()
    db.setdefault("coach", []).append({
        "tema": req.tema,
        "nivel": req.nivel,
        "userId": req.userId,
        "response": ai_res
    })
    write_db(db)

    return {"prompt": prompt, "ai": ai_res}

@app.get("/")
def root():
    return {"msg": "FastAPI backend funcionando"}

@app.options("/{path:path}")
async def preflight_handler(path: str):
    return JSONResponse(content={}, headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    })

@app.post("/forum/post")
def create_forum_post(post: ForumPost = Body(...)):
    db = read_db()
    db.setdefault("forum_posts", []).append(post.dict())
    write_db(db)
    return {"message": "Post creado exitosamente."}

@app.get("/forum/posts")
def get_forum_posts():
    db = read_db()
    return db.get("forum_posts", [])

@app.post("/forum/reply")
def add_forum_reply(reply: ForumReply = Body(...)):
    db = read_db()
    posts = db.get("forum_posts", [])
    if reply.post_id < 0 or reply.post_id >= len(posts):
        return {"error": "Post no encontrado."}
    posts[reply.post_id].setdefault("replies", []).append({
        "email": reply.email,
        "content": reply.content,
        "timestamp": reply.timestamp
    })
    db["forum_posts"] = posts
    write_db(db)
    return {"message": "Respuesta agregada exitosamente."}

@app.delete("/forum/post/{post_id}")
def delete_forum_post(post_id: int, request: Request):
    db = read_db()
    posts = db.get("forum_posts", [])
    # Obtener email del usuario desde el query param
    user_email = request.query_params.get("email")
    if post_id < 0 or post_id >= len(posts):
        raise HTTPException(status_code=404, detail="Post no encontrado.")
    if posts[post_id]["email"] != user_email:
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este post.")
    posts.pop(post_id)
    db["forum_posts"] = posts
    write_db(db)
    return {"message": "Post eliminado exitosamente."}

class UpdateProfileRequest(BaseModel):
    email: EmailStr
    nombre: str
    apellido: str
    password: str

@app.put("/profile/update")
def update_profile(req: UpdateProfileRequest):
    db = read_db()
    users = db.get('users', [])
    user = next((u for u in users if u['email'] == req.email), None)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    user['nombre'] = req.nombre
    user['apellido'] = req.apellido
    user['password'] = req.password
    write_db(db)
    return {"message": "Perfil actualizado exitosamente."}

load_dotenv()

print("AI_PROVIDER cargado:", os.getenv("AI_PROVIDER"))
print("API_KEY cargada:", os.getenv("AI_API_KEY"))
