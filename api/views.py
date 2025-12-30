from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import StructureC04, StructureI01, StructureI02
from api.serializers import (
    StructureC04Serializer, 
    StructureI01Serializer, 
    StructureI02ReadSerializer, 
    StructureI02PayloadSerializer
)
from api.services import I02Service

class StructureC04ViewSet(viewsets.ModelViewSet):
    queryset = StructureC04.objects.all()
    serializer_class = StructureC04Serializer

class StructureI01ViewSet(viewsets.ModelViewSet):
    queryset = StructureI01.objects.all()
    serializer_class = StructureI01Serializer

class StructureI02ViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ReadOnly ViewSet for I02. 
    Creation is strictly handled via the 'generate' action.
    """
    queryset = StructureI02.objects.all()
    serializer_class = StructureI02ReadSerializer

    @action(detail=False, methods=['post'], url_path='generate')
    def generate(self, request):
        """
        Endpoint to generate an I02 record from full history payload.
        """
        serializer = StructureI02PayloadSerializer(data=request.data)
        if serializer.is_valid():
            # Pass validated data to service to create record
            I02Service.create_i02_from_payload(serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
