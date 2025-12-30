from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import StructureC04ViewSet, StructureI01ViewSet, StructureI02ViewSet

router = DefaultRouter()
router.register(r'c04', StructureC04ViewSet)
router.register(r'i01', StructureI01ViewSet)
router.register(r'i02', StructureI02ViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
