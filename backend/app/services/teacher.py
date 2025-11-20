def build_prompt(competencia: str, tipo: str):
    return f"""
Eres un generador académico. Produce {tipo} basado en la competencia:

{competencia}

Debes incluir:
- 5 preguntas tipo test con respuestas
- 1 caso clínico con variantes
- Rúbrica breve

Responde en formato ordenado.
"""
