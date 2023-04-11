from recommender_system.server.app import create_app

if __name__ == "__main__":
    app = create_app()
    storage = app.container.storage()
    storage.makemigrations()
