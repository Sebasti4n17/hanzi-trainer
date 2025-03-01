import os
import requests
import psycopg2

# Conexión a la base de datos PostgreSQL
DB_CONFIG = {
    "dbname": "hanzi-trainer",
    "user": "postgres",
    "password": "5h15p417",
    "host": "localhost",  # Cambia si tu DB está en otro servidor
    "port": "5432"
}

def get_words_from_db():
    """Obtiene las palabras en chino desde la base de datos y crea el diccionario para descargar los audios."""
    words = {}
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT hanzi FROM word")
        rows = cur.fetchall()
        
        # Crear el diccionario con nombres de archivos
        words = {row[0]: f"{row[0]}.mp3" for row in rows}

        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error al conectar con la base de datos: {e}")
    
    return words

# Obtener palabras desde la base de datos
words = get_words_from_db()

# Asegurar que la carpeta public/audio/ existe
os.makedirs("public/audio", exist_ok=True)

# Descargar cada audio usando la API correcta
for hanzi, filename in words.items():
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q={hanzi}&tl=zh-CN"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})

    if response.status_code == 200:
        with open(f"public/audio/{filename}", "wb") as f:
            f.write(response.content)
        print(f"✅ {filename} descargado correctamente.")
    else:
        print(f"❌ Error al descargar {filename} - Código {response.status_code}")
