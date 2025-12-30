from api.models import StructureI02

class I02Service:
    @staticmethod
    def create_i02_from_payload(payload):
        """
        Creates an I02 record from a full JSON payload.
        Ensures that data is validated before creation.
        """
        # Business logic for consistent creation could go here.
        # For now, we simply create the record as valid payload is assumed (validated by serializer).
        return StructureI02.objects.create(**payload)
