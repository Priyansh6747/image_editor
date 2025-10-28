from fastapi import FastAPI
from Routes.HandleText import TextRouter
from Routes.HandleImage import ImageRouter
app = FastAPI()


app.include_router(TextRouter,prefix="/text")
app.include_router(ImageRouter,prefix="/image")
@app.get("/")
async def root():
    return {"message": "Hello World"}
