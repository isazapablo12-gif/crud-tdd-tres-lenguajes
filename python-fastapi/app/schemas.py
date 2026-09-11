from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str
    description: str | None = Field(default=None, max_length=500)
    completed: bool = False


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool

