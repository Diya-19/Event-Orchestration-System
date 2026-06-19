from app.db import Base, engine
import app.models  # This imports all models and registers them with Base

print("🔨 Creating database tables...")
Base.metadata.create_all(engine)
print("✅ All tables created successfully!")