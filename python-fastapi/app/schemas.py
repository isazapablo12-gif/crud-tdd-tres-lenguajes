from pydantic import BaseModel, Field, field_validator


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    completed: bool = False

    @field_validator("title", mode="before")
    @classmethod
    def normalize_title(cls, value: object) -> object:
        if not isinstance(value, str):
            return value
        normalized = value.strip()
        if not normalized:
            raise ValueError("Title is required")
        return normalized


class TaskUpdate(TaskCreate):
    completed: bool


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool
