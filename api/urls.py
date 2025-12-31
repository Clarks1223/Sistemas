from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import StructureC04ViewSet, StructureI01ViewSet, StructureI02ViewSet, CRMUploadViewSet

router = DefaultRouter()
router.register(r'c04', StructureC04ViewSet)
router.register(r'i01', StructureI01ViewSet)
router.register(r'i02', StructureI02ViewSet)
router.register(r'crm', CRMUploadViewSet, basename='crm')

urlpatterns = [
    path('', include(router.urls)),
]
