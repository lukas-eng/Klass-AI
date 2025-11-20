def build_prompt(tema: str, nivel: str):
    return f"""
Eres un asistente personal de estudio.

Explica el tema: {tema}
Nivel: {nivel}

Incluye:
1. Explicación corta con 2 analogías
2. Mini test (3 preguntas)
3. Plan de estudio de 3 días
4. Repetición espaciada recomendada
"""
