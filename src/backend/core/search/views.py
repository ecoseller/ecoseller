# search/views.py

import abc
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

from rest_framework.response import Response
from elasticsearch_dsl import Q
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.views import APIView
from django.conf import settings
from country.models import Country
from product.models import PriceList
from product.serializers import ProductStorefrontListSerializer

from product.documents import ProductDocument


@permission_classes((AllowAny,))
class PaginatedElasticSearchAPIView(APIView):
    PRICE_LIST_URL_PARAM = "pricelist"
    COUNTRY_URL_PARAM = "country"

    serializer_class = None
    document_class = None
    pagination_class = LimitOffsetPagination()
    language = "cs"
    pricelist = None
    country = None
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

    def get_country(self, request):
        """Get country URL param"""
        country_code = request.query_params.get(self.COUNTRY_URL_PARAM, None)
        try:
            return Country.objects.get(code=country_code)
        except Country.DoesNotExist:
            country = Country.objects.all().first()

        return country

    def get_pricelist(self, request):
        """get price list from request params or default to the default one"""
        price_list_code = request.query_params.get(self.PRICE_LIST_URL_PARAM, None)
        if price_list_code:
            try:
                return PriceList.objects.get(code=price_list_code)
            except PriceList.DoesNotExist:
                return PriceList.objects.get(is_default=True)
        else:
            return PriceList.objects.get(is_default=True)

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
            print(objs)
            serializer = self.serializer_class(
                objs,
                many=True,
                context={
                    "request": self.request,
                    "pricelist": self.pricelist,
                    "country": self.country,
                },
            )
            return serializer.data
        else:
            return response.to_dict()["hits"]["hits"][0 : self.limit]

    def get(self, request, language, query):
        self.request = request
        self.limit = int(request.GET.get("limit", 6))

        try:
            self.initialize_langage(language)
            self.country = self.get_country(request)
            self.pricelist = self.get_pricelist(request)
            response = self.obtain_elastic_results(query)

            print(f'Found {response.hits.total.value} hit(s) for query: "{query}"')
            # print(response.to_dict())
            data = self.serialize_response(response)

            return Response(data)
        except Exception as e:
            return Response(str(e), status=500)


class SearchProducts(PaginatedElasticSearchAPIView):
    serializer_class = ProductStorefrontListSerializer
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
