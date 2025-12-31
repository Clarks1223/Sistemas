class CRMUploadSerializer(serializers.Serializer):
    judicial = serializers.FileField()
    vigente = serializers.FileField()
    clientes = serializers.FileField()

    def validate_file_extension(self, file_obj):
        if not file_obj.name.endswith('.xlsx'):
            raise serializers.ValidationError(f"El archivo {file_obj.name} debe ser un Excel (.xlsx)")
        return file_obj

    def validate_judicial(self, value):
        return self.validate_file_extension(value)

    def validate_vigente(self, value):
        return self.validate_file_extension(value)

    def validate_clientes(self, value):
        return self.validate_file_extension(value)
