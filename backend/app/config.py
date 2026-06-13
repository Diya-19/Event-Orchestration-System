from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    APP_SECRET: str
    GEMINI_API_KEY: str
    DEV_MODE: bool = True
    

    # This is the correct Pydantic v2 syntax. 
    # Do not include a "class Config:" block!
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()