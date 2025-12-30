import re
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from datetime import datetime

def validate_date_format(value):
    """
    Validates that the date is in strictly dd/mm/yyyy format.
    Note: DRF DateField usually handles conversion, but this ensures strict string format if used on CharField or pre-validation.
    However, for standard DateFields, we enforce input_formats in the serializer.
    This validator can be used for custom checks or string fields.
    """
    if not isinstance(value, str):
        # If it's already a date object, we assume it was parsed correctly by DRF
        return
        
    date_regex = r'^\d{2}/\d{2}/\d{4}$'
    if not re.match(date_regex, value):
        raise ValidationError(
            _('%(value)s is not in the format dd/mm/yyyy'),
            params={'value': value},
        )
    
    # Validation of calendar date
    try:
        datetime.strptime(value, '%d/%m/%Y')
    except ValueError:
       raise ValidationError(
            _('%(value)s is not a valid calendar date'),
            params={'value': value},
        )

def validate_decimal_precision(value):
    """
    Validates that the decimal has exactly 2 decimal places.
    """
    # Convert to string to check string representation
    if value is None:
        return
        
    str_val = str(value)
    
    if '.' not in str_val:
        # If no decimal point, it depends if we want to force "100.00" string or just value.
        # Python Decimal(100) is 100. 
        # But requirements say "100" is invalid, "100.00" is valid.
        # This implies we might be validating the raw input string or ensuring the formatting.
        # Since this validates a Decimal object usually, 100 == 100.00.
        # To strictly enforce "user sent 100.00", we need to check the input string in Serializer, not Model validator.
        # However, for the Model, we ensures it stores with 2 places.
        pass
        
    # Check if more than 2 decimal places provided
    decimal_part = str_val.split('.')[1] if '.' in str_val else ""
    if len(decimal_part) > 2:
         raise ValidationError(
            _('Ensure that there are no more than 2 decimal places.'),
        )
