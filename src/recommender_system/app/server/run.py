import os

from server.app import create_app


def run_server() -> None:
    host = os.environ["RS_SERVER_HOST"]
    port = int(os.environ["RS_SERVER_PORT"])
    debug = os.environ.get("RS_SERVER_DEBUG", "False").upper() == "TRUE"

    app = create_app()
    app.run(host=host, port=port, debug=debug, load_dotenv=False)
