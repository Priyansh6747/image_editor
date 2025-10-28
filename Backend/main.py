from fastapi import FastAPI
from Routes.HandleText import TextRouter
app = FastAPI()


app.include_router(TextRouter,prefix="/text")
@app.get("/")
async def root():
    return {"message": "Hello World"}
