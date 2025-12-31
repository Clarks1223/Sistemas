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

from api.utils import crm_processor
from api.serializers import CRMUploadSerializer

class CRMUploadViewSet(viewsets.ViewSet):
    """
    ViewSet to handle CRM file uploads (judicial, vigente, clientes).
    Processes files in-memory to generate TXT and upload via SFTP.
    """
    serializer_class = CRMUploadSerializer

    @action(detail=False, methods=['post'], url_path='upload')
    def upload(self, request):
        serializer = CRMUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        files_data = serializer.validated_data
        
        results = []
        errors = []

        # Process each file
        # We need to process 'judicial', 'vigente', 'clientes'
        
        for key, file_obj in files_data.items():
            # file_obj is an UploadedFile, acts as stream
            
            # Step 1: Detect type and get remote name using NEW strict key logic
            tipo, base_salida = crm_processor.obtener_configuracion_salida(key)
            
            if not tipo or not base_salida:
                # Esto no deberia ocurrir dada la validacion previa del serializer y keys fijas
                errors.append(f"Clave de archivo desconocida: {key}")
                continue

            # Step 2: Convert Excel stream to TXT stream
            # file_obj is readable.
            txt_stream = crm_processor.excel_a_texto_stream(file_obj, base_salida)
            
            if not txt_stream:
                errors.append(f"Error procesando contenido de {file_obj.name}")
                continue

            # Step 3: Upload to SFTP
            success, msg = crm_processor.cargar_archivo_sftp_stream(txt_stream, base_salida, tipo)
            
            if success:
                results.append(f"{file_obj.name} -> {base_salida} (Subido)")
            else:
                errors.append(f"Fallo subida SFTP para {file_obj.name}: {msg}")

        if errors:
            return Response({
                "status": "partial_success" if results else "error",
                "processed": results,
                "errors": errors
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR if not results else status.HTTP_207_MULTI_STATUS)

        return Response({
            "status": "success",
            "message": "Todos los archivos procesados y subidos exitosamente",
            "details": results
        }, status=status.HTTP_200_OK)
