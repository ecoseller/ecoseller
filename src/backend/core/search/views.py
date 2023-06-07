# search/views.py

import abc
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

from rest_framework.response import Response
from elasticsearch_dsl import Q
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
from django.conf import settings

from .serializers import ProductSuggestionsSerializer

from product.documents import ProductDocument


@permission_classes((AllowAny,))
class PaginatedElasticSearchAPIView(APIView):
    serializer_class = None
    document_class = None
    pagination_class = LimitOffsetPagination()
    language = "cs"
    request = None
    serializer_as_django_model = False

    available_languages = [lang["code"] for lang in settings.PARLER_LANGUAGES[None]]

    @abc.abstractmethod
    def generate_q_expression(self, query):
        """This method should be overridden
        and return a Q() expression."""

    def obtain_elastic_results(self, query):
        try:
            q = self.generate_q_expression(query)
            search = (
                self.document_class.search()
                .extra(size=self.limit)
                .query(q)
                .sort({"_score": {"order": "desc"}})
            )
            response = search.execute()
            print(f'Found {response.hits.total.value} hit(s) for query: "{query}"')
            return response
        except Exception as e:
            return Response(e, status=500)

    def initialize_langage(self, language):
        if language not in self.available_languages:
            raise ValueError(f'Language "{language}" is not available.')
        self.langauge = language

    def serialize_response(self, response):
        """
        This method fixed issue with Document and Model serializer.
        Since this class is used for both, we need to check which one is used using serializer_as_django_model flag.
        It then allows to obtain results from elastic search and serialize them using either by model or document serializer.
        """
        if self.serializer_as_django_model:
            response_ids = [
                x["_id"] for x in response.to_dict()["hits"]["hits"][0 : self.limit]
            ]
            objs = self.document_class.django.model._default_manager.filter(
                id__in=response_ids
            )
            serializer = self.serializer_class(
                objs,
                many=True,
                context={
                    "request": self.request,
                    "locale": self.language,
                    "pricelist": self.pricelist,
                    "representation": "list",
                },
            )
            return serializer.data
        else:
            return response.to_dict()["hits"]["hits"][0 : self.limit]

    def get(self, request, language, query):
        self.request = request
        self.limit = int(request.GET.get("limit", 6))
        self.pricelist = int(request.GET.get("pricelist", 7))

        try:
            self.initialize_langage(language)
            response = self.obtain_elastic_results(query)

            print(f'Found {response.hits.total.value} hit(s) for query: "{query}"')
            # print(response.to_dict())
            data = self.serialize_response(response)

            return Response(
                {"data": data, "total": len(response.to_dict()["hits"]["hits"])}
            )
        except Exception as e:
            return Response(str(e), status=500)


class SearchProducts(PaginatedElasticSearchAPIView):
    serializer_class = ProductSuggestionsSerializer
    document_class = ProductDocument
    serializer_as_django_model = True

    def generate_q_expression(self, query):
        return Q(
            "multi_match",
            query=query,
            fields=[
                "id^10.0",
                f"title.{self.langauge}^5.0",
                f"short_description.{self.langauge}^3.0",
                f"attribute_list.{self.langauge}^2.0",
            ],
        )
