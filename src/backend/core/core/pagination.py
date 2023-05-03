from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class DashboardPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = "limit"
    max_page_size = 150
    page_query_param = "page"

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )
