import uvicorn
from server import app 


def run_program():
    print("Запуск приложения через myrc...")

    uvicorn.run(app, host="0.0.0.0", port=8000)
