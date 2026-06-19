from celery import Celery
from dotenv import load_dotenv

load_dotenv()

# Initialize the Celery application
# "event_orchestrator" is just the name of your worker
# The broker and backend point to your local Redis server
celery_app = Celery(
    "event_orchestrator",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0" ,
    
    include=["app.tasks.communication_tasks","app.tasks.consolidate_scores_task", "app.tasks.event_workflow_tasks", ]
)

# Optional but recommended settings
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Tell Celery to automatically look for tasks inside your `app/tasks/` folder or `app/tasks.py` file
celery_app.autodiscover_tasks(["app"])