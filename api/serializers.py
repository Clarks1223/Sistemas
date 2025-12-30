from rest_framework import serializers
from api.models import StructureC04, StructureI01, StructureI02

# aqui las demas validaciones

class StructureC04Serializer(serializers.ModelSerializer):
    issueDate = serializers.DateField(input_formats=['%d/%m/%Y'], format='%d/%m/%Y')
    maturityDate = serializers.DateField(input_formats=['%d/%m/%Y'], format='%d/%m/%Y')
    accountingDate = serializers.DateField(input_formats=['%d/%m/%Y'], format='%d/%m/%Y')
    realizationDate = serializers.DateField(input_formats=['%d/%m/%Y'], format='%d/%m/%Y', required=False, allow_null=True)

    class Meta:
        model = StructureC04
        fields = '__all__'

class StructureI01Serializer(serializers.ModelSerializer):
    issueDate = serializers.DateField(input_formats=['%d/%m/%Y'], format='%d/%m/%Y')
    purchaseDate = serializers.DateField(input_formats=['%d/%m/%Y'], format='%d/%m/%Y')

    class Meta:
        model = StructureI01
        fields = '__all__'

class StructureI02PayloadSerializer(serializers.ModelSerializer):
    """
    Serializer for the 'generate' endpoint logic.
    Accepts full payload including I01 fields + I02 fields.
    """
    issueDate = serializers.DateField(input_formats=['%d/%m/%Y'])
    purchaseDate = serializers.DateField(input_formats=['%d/%m/%Y'])
    maturityDate = serializers.DateField(input_formats=['%d/%m/%Y'])
    lastRatingDate = serializers.DateField(input_formats=['%d/%m/%Y'])

    class Meta:
        model = StructureI02
        fields = '__all__'

class StructureI02ReadSerializer(serializers.ModelSerializer):
    """
    ReadOnly serializer for I02. Returns dates in standard ISO format by default 
    (or dd/mm/yyyy if requested, but ModelSerializer defaults to ISO for output usually).
    We can override to ensure output is also strictly dd/mm/yyyy if needed, 
    but prompt emphasized INPUT payloads. I will force output format too for consistency.
    """
    issueDate = serializers.DateField(format='%d/%m/%Y')
    purchaseDate = serializers.DateField(format='%d/%m/%Y')
    maturityDate = serializers.DateField(format='%d/%m/%Y')
    lastRatingDate = serializers.DateField(format='%d/%m/%Y')

    class Meta:
        model = StructureI02
        fields = '__all__'
