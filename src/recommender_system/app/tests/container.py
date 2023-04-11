from dependency_injector import containers

from recommender_system.server.container import Container


class UnittestContainer(Container):
    wiring_config = containers.WiringConfiguration(
        packages=["recommender_system", "tests"],
        auto_wire=False,
    )
