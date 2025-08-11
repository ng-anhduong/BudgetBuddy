from app import create_app, db
from app.triggers import create_triggers

app = create_app()

with app.app_context():
    db.create_all()
    create_triggers(db.engine)
    print("Tables created!")