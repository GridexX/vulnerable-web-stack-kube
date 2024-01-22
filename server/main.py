from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from pydantic import BaseModel


class Message(BaseModel):
    message: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def get_welcome_message():
    return {"message": "Welcome to the server"}

# Write a post messsage commaand that read the message in the body and execute a cowsay command and then return the output of the command
@app.post("/message")
def post_cowsay(messageClass: Message):
    # Read the message from the body in a JSON format in a variable called message
    message = messageClass.message
    command = "cowsay " + message
    output = os.popen(command)
    return {"stdout": output.read()}


@app.get("/health")
def read_health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
