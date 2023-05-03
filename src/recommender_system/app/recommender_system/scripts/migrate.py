from recommender_system.server.app import create_app


if __name__ == "__main__":
    app = create_app()
    for storage in [
        app.container.feedback_storage(),
        app.container.product_storage(),
        app.container.similarity_storage(),
    ]:
        storage.migrate()
